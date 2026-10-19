import assert from "node:assert/strict";
const base=process.env.PROFILE_TEST_BASE;
assert.equal(base,"http://127.0.0.1:8080","Use apenas API local descartável");
const failures=[];
async function call(method,path,body,token) {
 const multipart=body instanceof FormData;
 const r=await fetch(base+path,{method,headers:{...(!multipart?{"Content-Type":"application/json"}:{}),...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:multipart?body:JSON.stringify(body)}:{})});
 const raw=await r.text();let data;try{data=JSON.parse(raw);}catch{data=raw;}return [r.status,data];
}
function check(name,fn){try{fn();console.log("PASS "+name);}catch(e){failures.push(name);console.error("FAIL "+name+": "+e.message);}}
const unique=Date.now();const accounts=[];
for(const n of [1,2]) { const email=`profile-${unique}-${n}@example.test`;let r=await call("POST","/user",{name:`Profile ${n}`,email,password:"Test-only-password"});assert.equal(r[0],201);r=await call("POST","/login",{email,password:"Test-only-password"});assert.equal(r[0],200);accounts.push({email,token:r[1].token}); }
const token=accounts[0].token;
let r=await call("PUT","/user",{name:"Changed",email:accounts[0].email},token);
check("alterar nome mantendo próprio email",()=>assert.equal(r[0],200));
r=await call("PUT","/user",{name:"Changed",email:accounts[1].email},token);
check("email de outra conta 409 error",()=>assert.deepEqual(r,[409,{error:"E-mail já existente"}]));
for(const body of [{name:42,email:"valid@example.test",password:"pw"},{name:"Name",email:"invalid-email",password:"pw"},{name:"Name",email:`bad-${unique}@example.test`,password:42}]) {
 r=await call("POST","/user",body);check("cadastro inválido 400 "+JSON.stringify(body),()=>{assert.equal(r[0],400);assert.equal(typeof r[1].error,"string");});
}
r=await call("PUT","/user",{name:"Changed",email:"invalid-email"},token);check("atualização email inválido 400",()=>assert.equal(r[0],400));
r=await call("POST","/user",{name:"Name",email:"!@!."+"!.".repeat(10000),password:"pw"});check("email adversarial longo 400",()=>assert.equal(r[0],400));
r=await call("PUT","/user/upload",new FormData(),token);check("upload ausente 400 error",()=>assert.deepEqual(r,[400,{error:"Imagem não foi enviada"}]));
for(const [name,type,size,expected] of [["JPEG válido","image/jpeg",100,200],["PNG válido","image/png",100,200],["tipo inválido","text/plain",100,415],["tipo parecido inválido","image/png-untrusted",100,415],["acima de 10 MB","image/png",10*1024*1024+1,413]]) {
 const form=new FormData();form.append("image",new Blob([new Uint8Array(size)],{type}),"test-file");r=await call("PUT","/user/upload",form,token);check(name,()=>{assert.equal(r[0],expected);if(expected===200)assert.equal(r[1].url,"https://example.test/profile.png");else assert.equal(typeof r[1].error,"string");});
}
r=await call("GET","/user",undefined,token);check("URL persistida sem hash",()=>{assert.equal(r[1].user.urlImage,"https://example.test/profile.png");assert.ok(!("password" in r[1].user));});
for(const a of accounts){r=await call("DELETE","/user",undefined,a.token);check("DELETE 204 vazio",()=>assert.deepEqual(r,[204,""]));}
assert.equal(failures.length,0,failures.join("; "));
