import fs from "node:fs";
import path from "node:path";

export class RelativePathLoader {
    private readonly root: Path;

    private constructor(root: Path) {
        if (!new File(root).isDirectory()) {
            throw new Error();
        }

        this.root = root;
    }

    public relative(string: string): Path {
        return this.root.concat(string);
    }

    public static ofCurrentDirectory(importMeta: ImportMeta): RelativePathLoader {
        return new RelativePathLoader(Path.absolute(importMeta.dir));
    }
}

export class Path {
    private readonly directory: string;

    private readonly name: string;

    private readonly extention: string;

    private constructor(string: string) {
        const parseResult = path.parse(string.replaceAll('/', Path.SEPARATOR_CHAR));

        this.directory = parseResult.dir;
        this.name = parseResult.name;
        this.extention = parseResult.ext;
    }

    public concat(...strings: string[]): Path {
        return new Path(path.join(this.toString(), ...strings));
    }

    public parent(): Path {
        return new Path(this.directory);
    }

    public toFile(): File {
        return new File(this);
    }

    public toString(): string {
        return this.directory + Path.SEPARATOR_CHAR + this.name + this.extention;
    }

    public static absolute(string: string): Path {
        return new Path(string);
    }

    public static readonly SEPARATOR_CHAR: string = '\\';
}

export class File {
    protected readonly path: Path;

    public constructor(path: Path) {
        this.path = path;
    }

    public getPath(): Path {
        return this.path;
    }

    public exists(): boolean {
        return fs.existsSync(this.path.toString());
    }

    public isFile(): boolean {
        if (!this.exists()) {
            throw new Error();
        }

        const stat = fs.statSync(this.path.toString());
        return stat.isFile();
    }

    public isDirectory() {
        return !this.isFile();
    }

    public create(createParentDirectories: boolean = false) {
        if (!this.exists()) {
            if (createParentDirectories) fs.mkdirSync(this.path.parent().toString(), { recursive: true });
            fs.writeFileSync(this.path.toString(), '', "utf-8");
        }
    }

    public delete() {
        if (this.exists()) {
            fs.rmSync(this.path.toString(), {
                recursive: true,
                force: true
            });
        }
    }

    public copyTo(destination: Path) {
        if (!this.exists()) {
            throw new Error();
        }

        if (this.isFile()) {
            fs.copyFileSync(this.path.toString(), destination.toString());
        }
        else {
            fs.mkdirSync(destination.toString(), {
                recursive: true
            });

            const files = fs.readdirSync(this.path.toString(), {
                withFileTypes: true
            });

            for (const file of files) {
                const childSourceFile = new File(this.path.concat(file.name));
                const childDestinationPath = destination.concat(file.name);
                childSourceFile.copyTo(childDestinationPath);
            }
        }
    }
}

export class TextFile extends File {
    public constructor(path: Path) {
        super(path);
    }

    public read(encoding: BufferEncoding): string[] {
        return fs.readFileSync(this.path.toString(), { encoding }).split('\n');
    }

    public write(contents: string[], encoding: BufferEncoding) {
        fs.writeFileSync(this.path.toString(), contents.join('\n'), { encoding });
    }

    public fromFile(file: File): TextFile {
        return new TextFile(file.getPath());
    }
}

export namespace minecraftAddonDevelopment {
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

        function __deploy__(src: Path, dest: Path): void {
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
            __deploy__(src, dest);
        }

        if (deployment.resource !== undefined) {
            const dest = developmentResourcePacks.concat(deployment.resource);
            const src = rpl.relative(deployment.resource);
            __deploy__(src, dest);
        }
    }
}
