export class SyncInfo{
    word;
    kind; // "man" | "woman"
    start;
    end;
    constructor(word, kind, start, end){
        this.word = word;
        this.kind = kind ?? "man";
        this.start = start;
        this.end = end;
    }
}