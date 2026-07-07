export type RecipeRelation = {

    parentId: number;
    childId: number;

};


export function isCircularyDependent(

	targetParentId: number,
	componentToAddId: number,
	currentRelations: RecipeRelation[]

): boolean {

	if (targetParentId == componentToAddId){

		return true;
	}

	const childrenMap = new Map<number, number[]>();
	for(const rel of currentRelations){
		if (!childrenMap.has(rel.parentId)){
			childrenMap.set(rel.parentId, []);
		}
        childrenMap.get(rel.parentId)!.push(rel.childId);
	}

	const stack = [componentToAddId];
	const visited = new Set<number>();

	while (stack.length > 0){
		const currentNode =stack.pop()!;
        
		if(currentNode === targetParentId) {
			return true;
		}

		if(!visited.has(currentNode)){
			visited.add(currentNode);
            
			const children = childrenMap.get(currentNode) || [];
			for(const child of children){
				stack.push(child);
			}

		}


	}

    
    
	return false;
}
