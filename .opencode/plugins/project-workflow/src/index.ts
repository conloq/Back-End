import { Plugin } from "@opencode/plugin"
import { spawn } from "node:child_process"
import { promisify } from "node:util"

type ExecResult = { code: number; stdout: string; stderr: string }

function execFile(command: string, args: string[], cwd: string): Promise<ExecResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, shell: false })
    let stdout = ""
    let stderr = ""
    child.stdout.on("data", (d) => (stdout += String(d)))
    child.stderr.on("data", (d) => (stderr += String(d)))
    child.on("error", reject)
    child.on("close", (code) => resolve({ code: code ?? 1, stdout, stderr }))
  })
}

function isGitCommit(command: string): boolean {
  // Integration-only detection: recognize a commit attempt without interpreting project semantics.
  return /(^|[;&|]\s*)git\s+commit(\s|$)/.test(command.trim())
}

export default Plugin.define({
  id: "project.workflow",
  async setup(ctx) {
    const projectDir = ctx.location.project.directory

    // Expose objective workflow state to the model. No semantic risk classification lives here.
    const toolRegistration = await ctx.tool.transform((editor) => {
      editor.namespace({
        name: "workflow",
        description: "Objective local workflow state. Semantic interpretation belongs to project skills and the model.",
      })

      editor.add({
        name: "delivery_status",
        description: "Check whether the current Git working state matches the state approved by the delivery quality gate.",
        input: { type: "object", properties: {}, additionalProperties: false },
        options: { namespace: "workflow", codemode: true },
        execute: async () => {
          const result = await execFile("python", ["scripts/delivery_gate_guard.py", "status"], projectDir)
          return { content: result.stdout || result.stderr }
        },
      })

      editor.add({
        name: "change_evidence",
        description: "Collect objective Git change evidence for semantic impact analysis by the model and project skill.",
        input: { type: "object", properties: {}, additionalProperties: false },
        options: { namespace: "workflow", codemode: true },
        execute: async () => {
          const result = await execFile("python", ["scripts/change_evidence.py"], projectDir)
          return { content: result.stdout || result.stderr }
        },
      })
    })

    // V2 shell hook: block only the objective condition "commit attempted with stale/unapproved gate".
    // This is intentionally not a semantic code-quality decision.
    const shellRegistration = await ctx.shell.hook("create.before", async (event) => {
      if (!isGitCommit(event.command)) return

      const result = await execFile("python", ["scripts/delivery_gate_guard.py", "check"], event.cwd || projectDir)
      if (result.code !== 0) {
        throw new Error(
          "Delivery gate is missing or stale for the current Git state. Run the project delivery-quality-gate skill, then approve this exact state before committing."
        )
      }
    })

    return async () => {
      await shellRegistration.dispose()
      await toolRegistration.dispose()
    }
  },
})
