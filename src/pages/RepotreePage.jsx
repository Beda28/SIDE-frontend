import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function buildTree(flatList) {
  const tree = { name: '', children: [] };
  const nodes = { '': tree };
  for (const item of flatList) {
    const pathParts = item.path.split('/');
    let currentNode = tree;
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      const currentPath = pathParts.slice(0, i + 1).join('/');
      if (!nodes[currentPath]) {
        const newNode = {
          name: part,
          type: item.type,
          path: currentPath,
          children: item.type === 'tree' ? [] : undefined,
        };
        currentNode.children.push(newNode);
        nodes[currentPath] = newNode;
      }
      currentNode = nodes[currentPath];
    }
  }
  return tree.children;
}

const TreeItem = ({ item }) => {
  const isDirectory = item.type === 'tree';
  return (
    <div style={{ marginLeft: '15px' }}>
      <p style={{ margin: 0, padding: 5, backgroundColor: isDirectory ? '#f0f0f0' : 'transparent' }}>
        {isDirectory ? '📁 ' : '📄 '}
        {item.name}
      </p>
      {isDirectory && item.children && (
        <div style={{ marginLeft: '10px' }}>
          {item.children.map((child) => (
            <TreeItem key={child.path} item={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Tree() {
  const { owner, reponame } = useParams();
  const [repoTree, setRepoTree] = useState([]);
  const fullName = `${owner}/${reponame}`;

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await axios.post(
          `${API_BASE}/api/repo/repotree`,
          { full_name: fullName },
          { withCredentials: true }
        );
        if (res.data) {
          const nestedTree = buildTree(res.data);
          setRepoTree(nestedTree);
        }
      } catch (error) {
        console.error('Failed to fetch tree:', error);
      }
    };
    fetchTree();
  }, [fullName]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Repository: {fullName}</h1>
      <Link to={`/ide/${fullName}`}>
        <button>IDE 열기</button>
      </Link>
      
      <div style={{ marginTop: 20 }}>
        {repoTree.length ? (
          repoTree.map((item) => <TreeItem key={item.path} item={item} />)
        ) : (
          <p>레포지토리 트리를 불러오는 중이거나 내용이 없습니다.</p>
        )}
      </div>
    </div>
  );
}