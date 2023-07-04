import React from "react";
import { FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import { CiFolderOff } from "react-icons/ci";
import TreeView, { flattenTree } from "react-accessible-treeview";
import './FolderTreeFilter.scss'

class StoreClass {
    constructor() {
        // this.networks = {
        //     selectedNodes: [],
        // };
        this.networks = new Map();

        //load from localstorage
        const _networks = localStorage.getItem('CozyNest/FolderTreeFilter');
        if (_networks) {
            this.networks = new Map(Object.entries(JSON.parse(_networks)));
        }
        else {
            this.networks.set('models', {selectedNodes: []});
            this.networks.set('embeddings', {selectedNodes: []});
            this.networks.set('lora', {selectedNodes: []});
            this.networks.set('hypernetworks', {selectedNodes: []});
            this.save();
        }
    }

    selectNode(network, id) {
        if (!this.networks.has(network)) {
            this.networks.set(network, {selectedNodes: []});
        }


        this.networks.get(network).selectedNodes.push(id);
        this.save();
    }

    unSelectNode(network, id) {
        this.networks.get(network).selectedNodes = this.networks.get(network).selectedNodes.filter(_id => _id !== id);
        this.save();
    }

    save() {
        //save in localstorage?
        // localStorage.setItem('CozyNest/FolderTreeFilter', JSON.stringify(Object.fromEntries(this.networks)));
    }
}
const Store = new StoreClass();

export function FolderTreeFilter({hasSubFolders, folder, selectHandler, forNetwork}) {

    //add a fake 'all' folder as first element of children
    //check if first element is 'all'. If not, add it
    const _folder = {...folder};
    if (hasSubFolders && folder.children[0].name === 'all') {
        _folder.children = [{name: 'all', children: []}, ..._folder.children];
    }

    // load selected nodes from store
    const selectedNodesName = Store.networks.get(forNetwork)?.selectedNodes || [];

    const data = flattenTree(_folder);

    const selectedNodes
        = data.filter(node => selectedNodesName.includes(node.name)).map(node => node.id);

        function onNodeSelect({element}) {
        selectHandler({element})
    }

    function onExpand(branch) {
        if (branch.isExpanded) {
            Store.selectNode(forNetwork, branch.element.name);
        }
        else {
            Store.unSelectNode(forNetwork, branch.element.name);
        }
    }

    if (!hasSubFolders) {
        return (
            <div className="EmptyFolderTreeFilter"></div>
        )
    }

    return (
        <div className="FolderTreeFilter nevysha nevysha-scrollable">
            <div className="directory">
                <TreeView
                    data={data}
                    aria-label="directory tree"
                    onNodeSelect={onNodeSelect}
                    defaultExpandedIds={selectedNodes}
                    onExpand={onExpand}
                    nodeRenderer={({
                                       element,
                                       isBranch,
                                       isExpanded,
                                       getNodeProps,
                                       level,
                                   }) => (
                        <div {...getNodeProps()} style={{ paddingLeft: 20 * (level - 1) }}>
                            {isBranch ? (
                                <FolderIcon isOpen={isExpanded} />
                            ) : (
                                <FileIcon filename={element.name} />
                            )}

                            {element.name}
                        </div>
                    )}
                />
            </div>
        </div>
    );
}

const FolderIcon = ({ isOpen }) =>
    isOpen ? (
        <FaRegFolderOpen color="e8a87c" className="icon" />
    ) : (
        <FaRegFolder color="e8a87c" className="icon" />
    );

const FileIcon = () => <CiFolderOff color="var(--nevysha-font-color)" className="icon" />

