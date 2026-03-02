import { Path, RelativePathLoader, TextFile } from "./FileSystem";

export namespace minecraft {
    export const sharedGamesComMojang: Path = Path.absolute("C:\\Users\\wakab\\AppData\\Roaming\\Minecraft Bedrock\\Users\\Shared\\games\\com.mojang");

    export const developmentBehaviorPacks: Path = sharedGamesComMojang.concat("development_behavior_packs");

    export const developmentResourcePacks: Path = sharedGamesComMojang.concat("development_resource_packs");

    export interface Deployment {
        readonly behavior?: string;

        readonly resource?: string;

        readonly importMeta: ImportMeta;
    }

    export function deployToDevelopmentDirectories(deployment: Deployment) {
        const rpl = RelativePathLoader.ofCurrentDirectory(deployment.importMeta);

        function set(src: Path, dest: Path): void {
            const srcFile = src.toFile();

            if (!srcFile.exists()) {
                throw new Error();
            }

            if (srcFile.isFile()) {
                throw new Error();
            }

            dest.toFile().delete();
            src.toFile().copyTo(dest);
        }

        if (deployment.behavior !== undefined) {
            const dest = developmentBehaviorPacks.concat(deployment.behavior);
            const src = rpl.relative(deployment.behavior);
            set(src, dest);
        }

        if (deployment.resource !== undefined) {
            const dest = developmentResourcePacks.concat(deployment.resource);
            const src = rpl.relative(deployment.resource);
            set(src, dest);
        }
    }

   type MinecraftVersion
        = [1, 21, 70]
        | [1, 21, 90]
        | [1, 21, 111]
        | [1, 21, 130]
        | [1, 26, 1]
        | [1, 26, 2];

    interface ManifestHeader {
        readonly name: string;

        readonly description: string;

        readonly uuid?: string;

        readonly version?: [number, number, number];

        readonly min_engine_version: MinecraftVersion;
    }

    export enum ManifestModuleType {
        Data = "data",
        Resources = "resourceS",
        Script = "script"
    }

    interface ManiestModule {
        readonly type: ManifestModuleType;

        readonly description?: string;

        readonly uuid?: string;

        readonly version?: [number, number, number];
    }

    export enum ManifestScriptLanguage {
        JavaScript = "javascript"
    }

    interface ManifestScriptModule extends ManiestModule {
        readonly type: ManifestModuleType.Script;

        readonly language: ManifestScriptLanguage;

        readonly entry: string;
    }

    export enum ManifestCapability {
        ScriptEval = "script_eval",
        ExperimentalCustomUi = "experimental_custom_ui",
        Raytraced = "raytraced",
        EditorExtension = "editorExtension",
        Chemistry = "chemistry"
    }

    interface ManifestAddonDependency {
        readonly uuid: string;

        readonly version?: [number, number, number];
    }

    export enum ScriptModule {
        MinecraftServer = "@minecraft/server",
        MinecraftServerUi = "@minecraft/server-ui",
        MinecraftServerGametest = "@minecraft/server-gametest",
        MinecraftServerGraphics = "@minecraft/server-graphics",
        MinecraftDebugUtilities = "@minecraft/debug-utilities",
        MinecraftDiagnostics = "@minecraft/diagnostics",
        MinecraftServerNet = "@minecraft/server-net",
        MinecraftServerAdmin = "@minecraft/server-admin"
    }

    type MinecraftServerVersion
        = "beta"
        | "2.5.0";
    
    type MinecraftServerUiVersion
        = "beta"
        | "2.0.0";

    type MinecraftServerGametestVersion
        = "beta";

    type MinecraftServerGraphicsVersion
        = "beta";

    type MinecraftDebugUtilitiesVersion
        = "beta";

    type MinecraftDiagnosticsVersion
        = "beta";

    type MinecraftServerNetVersion
        = "beta";

    type MinecraftServerAdminVersion
        = "beta";

    interface ManifestMinecraftServerModuleDependency {
        readonly module_name: ScriptModule.MinecraftServer;

        readonly version: MinecraftServerVersion;
    }

    interface ManifestMinecraftServerUiModuleDependency {
        readonly module_name: ScriptModule.MinecraftServerUi;

        readonly version: MinecraftServerUiVersion;
    }

    interface ManifestMinecraftServerGametestModuleDependency {
        readonly module_name: ScriptModule.MinecraftServerGametest;

        readonly version: MinecraftServerGametestVersion;
    }

    interface ManifestMinecraftServerGraphicsModuleDependency {
        readonly module_name: ScriptModule.MinecraftServerGraphics;

        readonly version: MinecraftServerGraphicsVersion;
    }

    interface ManifestMinecraftDebugUtilitiesModuleDependency {
        readonly module_name: ScriptModule.MinecraftDebugUtilities;

        readonly version: MinecraftDebugUtilitiesVersion;
    }

    interface ManifestMinecraftDiagnosticsModuleDependency {
        readonly module_name: ScriptModule.MinecraftDiagnostics;

        readonly version: MinecraftDiagnosticsVersion;
    }

    interface ManifestMinecraftServerNetModuleDependency {
        readonly module_name: ScriptModule.MinecraftServerNet;

        readonly version: MinecraftServerNetVersion;
    }

    interface ManifestMinecraftServerAdminModuleDependency {
        readonly module_name: ScriptModule.MinecraftServerAdmin;

        readonly version: MinecraftServerAdminVersion;
    }

    type ManifestMinecraftScriptModuleDependency
        = ManifestMinecraftServerModuleDependency
        | ManifestMinecraftServerUiModuleDependency
        | ManifestMinecraftServerGametestModuleDependency
        | ManifestMinecraftServerGraphicsModuleDependency
        | ManifestMinecraftDebugUtilitiesModuleDependency
        | ManifestMinecraftDiagnosticsModuleDependency
        | ManifestMinecraftServerNetModuleDependency
        | ManifestMinecraftServerAdminModuleDependency;

    type ManifestDependency = ManifestAddonDependency | ManifestMinecraftScriptModuleDependency;

    interface ManifestMetadata {
        readonly authors?: string[];

        readonly license?: string;

        readonly url?: string;

        readonly product_type?: ManifestMetadataProductType;

        readonly generated_with?: Record<string, string[]>;
    }

    export enum ManifestMetadataProductType {
        Addon = "addon"
    }

    export interface Manifest {
        readonly format_version?: number;
    
        readonly header: ManifestHeader;

        readonly modules: (ManiestModule | ManifestScriptModule)[];

        readonly capabilities?: ManifestCapability[];

        readonly dependencies?: ManifestDependency[];

        readonly metadata?: ManifestMetadata;
    }

    export function uuidv4(): string {
        let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split('');

        for (let i = 0; i < chars.length; i++) {
            switch (chars[i]) {
                case 'x':
                    chars[i] = Math.floor(Math.random() * 16).toString(16);
                    break;
                case 'y':
                    chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                    break;
            }
        }

        return chars.join('');
    }

    export function createManifestJsonIfNotExists(importMeta: ImportMeta, path: string, manifest: Manifest): void {
        const manifestJson = RelativePathLoader.ofCurrentDirectory(importMeta).relative(path).toFile();

        if (manifestJson.exists()) {
            return;
        }

        const header: ManifestHeader = {
            name: manifest.header.name,
            description: manifest.header.description,
            uuid: manifest.header.uuid ?? uuidv4(),
            version: manifest.header.version ?? [1, 0, 0],
            min_engine_version: manifest.header.min_engine_version
        };

        const modules: ManiestModule[] = [];

        for (const module of manifest.modules) {
            modules.push({
                type: module.type,
                description: module.description ?? '',
                uuid: module.uuid ?? uuidv4(),
                version: module.version ?? [1, 0, 0]
            });
        }

        const dependencies: ManifestDependency[] = manifest.dependencies?.map(dependency => {
            if ("uuid" in dependency) {
                return { uuid: dependency.uuid, version: dependency.version ?? [1, 0, 0] };
            }
            else {
                return dependency;
            }
        }) ?? [];

        const json = JSON.stringify({
            format_version: manifest.format_version ?? 2,
            header,
            modules,
            dependencies,
            capabilities: manifest.capabilities,
            metadata: manifest.metadata
        }, undefined, 4);

        manifestJson.create();
        TextFile.fromFile(manifestJson).write(json.split('\n'), "utf-8");
    }

    export const MANIFEST_JSON: string = "manifest.json";
}
