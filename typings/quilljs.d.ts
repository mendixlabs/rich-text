import { EventEmitter } from "quill";

declare module "quill" {
    interface Quill extends EventEmitter {
        root: HTMLDivElement;
        sources: { API, USER, SILENT };
    }
}
