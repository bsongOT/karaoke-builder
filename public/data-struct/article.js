class Article{
    data;
    constructor(data){
        this.data = data;
    }
    get lastIndex(){
        return [this.data.length - 1, this.data[this.data.length - 1].length - 1];
    }
    insertLine(index, ...values){
        this.data.splice(index, 0, ...values);
    }
    at(index){
        if (!isNaN(index)) return this.data[index];
        return this.data[index[0]]?.[index[1]];
    }
    line(index){
        return this.data[index];
    }
    prev(index){
        const idx = this.prevIndex(index);
        return this.data[idx[0]]?.[idx[1]];
    }
    prevIndex(index){
        if (index[1] >= 1) return [index[0], index[1] - 1];
        else return [index[0] - 1, (this.data[index[0] - 1]?.length ?? 0) - 1];
    }
    next(index){
        const idx = this.nextIndex(index);
        return this.data[idx[0]]?.[idx[1]];
    }
    nextIndex(index){
        if (index[1] < this.data[index[0]].length - 1) return [index[0], index[1] + 1];
        else return [index[0] + 1, 0];
    }
    map(func){
        return this.data.map(func);
    }
    findIndex(func){
        const idx1 = this.data.findIndex(l => l.some(func));
        const idx2 = this.data[idx1]?.findIndex(func) ?? -1;

        return [idx1, idx2];
    }
	findLastIndex(func){
		const idx1 = this.data.findLastIndex(l => l.some(func));
        const idx2 = this.data[idx1]?.findLastIndex(func) ?? -1;
		
		return [idx1, idx2];
	}
}