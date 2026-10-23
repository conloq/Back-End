// code-wiki:start
// Summary: Interrompe o teste se o bootstrap da API tentar sincronizar models.
// Description: Preload de verificacao; nao interfere no sequelize-cli executado pelo prestart.
// code-wiki:end
if (process.argv[1]?.endsWith("/app.js")) {
    const { default: Connection } = await import("../config/sequelize-config.js");
    const { Model } = await import("sequelize");
    const fail = () => { throw new Error("Runtime tentou sync(); o schema deve vir das migrations"); };
    Connection.sync = fail;
    Model.sync = fail;
}
