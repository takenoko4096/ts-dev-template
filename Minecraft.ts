import { Path, RelativePathLoader, TextFile } from "./FileSystem";
import { TypeModel, typeSentry } from "./libs/TypeSentry";

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
            const dest = developmentBehaviorPacks.concat(deployment.behavior === '.' ? Path.absolute(deployment.importMeta.dirname).name : deployment.behavior);
            const src = deployment.behavior === '.' ? rpl.getRoot() : rpl.relative(deployment.behavior);
            set(src, dest);
        }

        if (deployment.resource !== undefined) {
            const dest = developmentResourcePacks.concat(deployment.resource === '.' ? Path.absolute(deployment.importMeta.dirname).name : deployment.resource);
            const src = deployment.resource === '.' ? rpl.getRoot() : rpl.relative(deployment.resource);
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

        readonly uuid: string;

        readonly version: [number, number, number];

        readonly min_engine_version: MinecraftVersion;
    }

    export enum ManifestModuleType {
        Data = "data",
        Resources = "resources",
        Script = "script"
    }

    interface ManifestModule {
        readonly type: ManifestModuleType;

        readonly description: string;

        readonly uuid: string;

        readonly version: [number, number, number];
    }

    export enum ScriptLanguage {
        JavaScript = "javascript"
    }

    interface ManifestScriptModule extends ManifestModule {
        readonly type: ManifestModuleType.Script;

        readonly language: ScriptLanguage;

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

        readonly version: [number, number, number];
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

        readonly product_type?: MetadataProductType;

        readonly generated_with?: Record<string, string[]>;
    }

    export enum MetadataProductType {
        Addon = "addon"
    }

    export interface Manifest {
        readonly format_version: number;
    
        readonly header: ManifestHeader;

        readonly modules: (ManifestModule | ManifestScriptModule)[];

        readonly capabilities?: ManifestCapability[];

        readonly dependencies?: ManifestDependency[];

        readonly metadata?: ManifestMetadata;
    }

    export interface ManifestInput {
        readonly format_version?: number;
    
        readonly header: ManifestHeaderInput;

        readonly modules: (ManiestModuleInput | ManifestScriptModuleInput)[];

        readonly capabilities?: ManifestCapability[];

        readonly dependencies?: (ManifestAddonDependencyInput | ManifestMinecraftScriptModuleDependency)[];

        readonly metadata?: ManifestMetadata;
    }

    interface ManifestHeaderInput {
        readonly name: string;

        readonly description: string;

        readonly uuid: string;

        readonly version?: [number, number, number];

        readonly min_engine_version: MinecraftVersion;
    }

    interface ManiestModuleInput {
        readonly type: ManifestModuleType;

        readonly description?: string;

        readonly uuid?: string;

        readonly version?: [number, number, number];
    }

    interface ManifestScriptModuleInput extends ManiestModuleInput {
        readonly type: ManifestModuleType.Script;

        readonly language?: ScriptLanguage;

        readonly entry: string;
    }

    interface ManifestAddonDependencyInput {
        readonly uuid: string;

        readonly version?: [number, number, number];
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

    const VersionModel: TypeModel<[number, number, number]> = typeSentry.tupleOf(
        typeSentry.number.nonNaN().int(),
        typeSentry.number.nonNaN().int(),
        typeSentry.number.nonNaN().int()
    );

    const ManifestAddonDependencyModel: TypeModel<ManifestAddonDependency> = typeSentry.structOf({
        uuid: typeSentry.string,
        version: VersionModel
    });

    const ManifestDependencyModel: TypeModel<ManifestDependency> = typeSentry.unionOf(
        ManifestAddonDependencyModel,
        typeSentry.structOf({
            module_name: typeSentry.string,
            version: typeSentry.string
        }) as TypeModel<ManifestMinecraftScriptModuleDependency>
    );

    export const ManifestModel: TypeModel<Manifest> = typeSentry.structOf({
        format_version: typeSentry.number.nonNaN().int(),
        header: typeSentry.structOf({
            name: typeSentry.string,
            description: typeSentry.string,
            uuid: typeSentry.string,
            version: VersionModel,
            min_engine_version: VersionModel as TypeModel<MinecraftVersion>
        }),
        modules: typeSentry.arrayOf(typeSentry.unionOf(
            typeSentry.structOf({
                type: typeSentry.enumLikeOf(ManifestModuleType),
                description: typeSentry.string,
                uuid: typeSentry.string,
                version: VersionModel
            }),
            typeSentry.structOf({
                type: typeSentry.literalOf(ManifestModuleType.Script),
                description: typeSentry.string,
                uuid: typeSentry.string,
                version: VersionModel,
                language: typeSentry.enumLikeOf(ScriptLanguage),
                entry: typeSentry.string
            })
        )),
        dependencies: typeSentry.optionalOf(typeSentry.arrayOf(ManifestDependencyModel)),
        capabilities: typeSentry.optionalOf(typeSentry.arrayOf(typeSentry.enumLikeOf(ManifestCapability))),
        metadata: typeSentry.optionalOf(typeSentry.structOf({
            authors: typeSentry.optionalOf(typeSentry.arrayOf(typeSentry.string)),
            license: typeSentry.optionalOf(typeSentry.string),
            url: typeSentry.optionalOf(typeSentry.string),
            product_type: typeSentry.optionalOf(typeSentry.enumLikeOf(MetadataProductType)),
            generated_with: typeSentry.optionalOf(typeSentry.recordOf(typeSentry.string, typeSentry.arrayOf(typeSentry.string)))
        }))
    });

    export class ManifestJson {
        private readonly path: Path;

        private static readonly manifests: Set<ManifestJson> = new Set();

        public constructor(importMeta: ImportMeta, relativePath: string) {
            this.path = RelativePathLoader.ofCurrentDirectory(importMeta).relative(relativePath);
            ManifestJson.manifests.add(this);
        }

        public exists(): boolean {
            return this.path.toFile().exists();
        }

        public read(): Manifest {
            if (!this.exists()) {
                throw new Error();
            }

            return JSON.parse(TextFile.fromFile(this.path.toFile()).read("utf-8").join(''));
        }

        public create(input: ManifestInput): void {
            const manifestJsonFile = TextFile.fromFile(this.path.toFile());

            if (manifestJsonFile.exists()) {
                return;
            }

            const json = JSON.stringify(ManifestJson.complete(input), undefined, 4);

            manifestJsonFile.create();
            manifestJsonFile.write(json.split('\n'), "utf-8");
        }

        private increment(index: number): void {
            const self = this.read();

            self.header.version[index] += 1;

            ManifestJson.manifests.forEach(manifest => {
                if (manifest === this) return;
                const text = manifest.read();
                let f = false;
                text.dependencies?.forEach(dependency => {
                    if (ManifestAddonDependencyModel.test(dependency)) {
                        if (dependency.uuid === self.header.uuid) {
                            dependency.version[index] += 1;
                            f = true;
                        }
                    }
                });
                if (f) {
                    TextFile.fromFile(manifest.path.toFile()).write(JSON.stringify(text, undefined, 4).split('\n'), "utf-8");
                }
            });

            TextFile.fromFile(this.path.toFile()).write(JSON.stringify(self, undefined, 4).split('\n'), "utf-8");
        }

        public incrementPatchVersion() {
            this.increment(2);
        }

        public incrementMinorVersion() {
            this.increment(1);
        }

        public incrementMajorVersion() {
            this.increment(0);
        }

        private static complete(input: ManifestInput): Manifest {
            const modules: (ManifestModule | ManifestScriptModule)[] = [];

            for (const module of input.modules) {
                if ("entry" in module) {
                    modules.push({
                        type: module.type,
                        description: module.description ?? '',
                        uuid: module.uuid ?? uuidv4(),
                        version: module.version ?? [1, 0, 0],
                        language: module.language ?? ScriptLanguage.JavaScript,
                        entry: module.entry
                    });
                }
                else {
                    modules.push({
                        type: module.type,
                        description: module.description ?? '',
                        uuid: module.uuid ?? uuidv4(),
                        version: module.version ?? [1, 0, 0]
                    });
                }
            }

            const dependencies: (ManifestAddonDependency | ManifestMinecraftScriptModuleDependency)[] = [];

            if (input.dependencies !== undefined) for (const dependency of input.dependencies) {
                if ("uuid" in dependency) {
                    dependencies.push({
                        uuid: dependency.uuid,
                        version: dependency.version ?? [1, 0, 0]
                    });
                }
                else {
                    dependencies.push(dependency);
                }
            }

            return {
                format_version: input.format_version ?? 2,
                header: {
                    name: input.header.name,
                    description: input.header.description,
                    uuid: input.header.uuid,
                    version: input.header.version ?? [1, 0, 0],
                    min_engine_version: input.header.min_engine_version
                },
                modules,
                dependencies: dependencies.length === 0 ? undefined : dependencies,
                capabilities: input.capabilities,
                metadata: input.metadata
            };
        }
    }
}
