import { TreeDataOrigin } from '@/components/common/group-tree/GroupTree';

export const transformGroup = (data: Record<string, any>[], title: string) => {
    const loop = (data: Record<string, any>) => {
        return data.map((l: Record<string, any>) => {
            const {
                id,
                children,
            } = l;
            const obj: TreeDataOrigin = {
                title: l[title],
                key: id,
                originData: l,
            };
            if (children?.length) {
                obj.children = loop(children);
                return obj;
            }
            return obj;
        });
    };
    return loop(data);
}

export const searchParentId = (treeData: TreeDataOrigin[], item: number) => {
    for (let i in treeData) {
        if (treeData[i].key === item) {
            return [treeData[i]].filter(v => v.key !== item)
        }

        if (treeData[i].children) {
            let node: any = searchParentId(treeData[i].children || [], item)
            if (node) return node.concat(treeData[i]).filter((v: any) => v.resourcesId !== item)
        }
    }
}