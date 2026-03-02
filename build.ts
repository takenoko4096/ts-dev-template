console.log("build start");

const output = await Bun.build({
    entrypoints: [
        "./src/index.ts"
    ],
    outdir: "scripts",
    target: "node",
    format: "esm",
    external: [
        "@minecraft/server",
        "@minecraft/server-ui",
        "@minecraft/server-graphics",
        "@minecraft/server-gametest",
        "@minecraft/server-net",
        "@minecraft/server-admin",
        "@minecraft/server-editor",
        "@minecraft/debug-utilities",
        "@minecraft/diagnostics",
        "@minecraft/common"
    ]
});

console.log("build finished: " + (output.success ? "successful" : "failure"));
