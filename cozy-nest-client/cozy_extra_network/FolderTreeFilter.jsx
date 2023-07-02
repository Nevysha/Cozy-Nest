import React from "react";
import { FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import { CiFolderOff } from "react-icons/ci";
import TreeView, { flattenTree } from "react-accessible-treeview";
import './FolderTreeFilter.scss'

export function FolderTreeFilter({folder}) {

    if (!folder || folder.length <= 0) {
        return (
            <div className="EmptyFolderTreeFilter"></div>
        )
    }

    const data = flattenTree(folder);

    return (
        <div className="FolderTreeFilter">
            <div className="directory">
                <TreeView
                    data={data}
                    aria-label="directory tree"
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

