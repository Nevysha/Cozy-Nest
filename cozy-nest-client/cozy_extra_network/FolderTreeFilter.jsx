import React from "react";
import { FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import { CiFolderOff } from "react-icons/ci";
import TreeView, { flattenTree } from "react-accessible-treeview";
import './FolderTreeFilter.scss'

export function FolderTreeFilter({hasSubFolders, folder, selectHandler}) {

    //add a fake 'all' folder as first element of children
    const _folder = {...folder};
    _folder.children = [{name: 'all', children: []}, ..._folder.children];

    const data = flattenTree(_folder);

    function onNodeSelect({element}) {
        selectHandler({element})
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

