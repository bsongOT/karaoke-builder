const updateQueue = [];

setInterval(() => {
	for (const q of updateQueue) q()
}, 25)

export function update(f){
    updateQueue.push(f);
}