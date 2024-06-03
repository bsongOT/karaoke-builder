export class SyncInfo{
    word;
    kind; // "default" | "strong" | "weak"
    start;
    end;
    constructor(word, kind, start, end){
        this.word = word;
        this.kind = kind ?? "default";
        this.start = start;
        this.end = end;
    }
}