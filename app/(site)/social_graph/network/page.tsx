'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-stone-500">Loading Network Graph...</div>
});

export default function SocialNetworkPage() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [minMentions, setMinMentions] = useState(3);
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    fetch('/api/social-graph/network')
      .then(res => res.json())
      .then(graphData => {
        setData(graphData);
        console.log("Loaded graph data:", graphData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load graph data", err);
        setLoading(false);
      });
  }, []);

  // Configure forces when graph is ready
  useEffect(() => {
    if (fgRef.current) {
      // Force nodes apart further
      fgRef.current.d3Force('charge').strength(-300);
      // Add collision force to prevent overlap
      fgRef.current.d3Force('collide', (node: any) => Math.max(10, Math.sqrt(node.val || 1) * 2));
    }
  }, [loading, focusedNode]); // Re-apply when focus changes too

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    
    setTimeout(updateDimensions, 100);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const filteredData = useMemo(() => {
    if (!data.nodes.length) return { nodes: [], links: [] };

    let links = [];
    if (focusedNode) {
        // Focus mode: Show ALL links connected to the focused node, ignoring minMentions
        links = data.links.filter((l: any) => {
            const s = typeof l.source === 'object' ? l.source.id : l.source;
            const t = typeof l.target === 'object' ? l.target.id : l.target;
            return s === focusedNode || t === focusedNode;
        });
    } else {
        // Normal mode: Filter by weight
        links = data.links.filter((l: any) => l.value >= minMentions);
    }

    // Clone links to avoid mutating state and apply curvature logic
    const processedLinks = links.map((l: any) => ({ ...l }));
    const pairMap = new Map<string, any[]>();

    processedLinks.forEach((l: any) => {
        const s = typeof l.source === 'object' ? l.source.id : l.source;
        const t = typeof l.target === 'object' ? l.target.id : l.target;
        
        const key = [s, t].sort().join(':');
        if (!pairMap.has(key)) pairMap.set(key, []);
        pairMap.get(key)!.push(l);
    });

    pairMap.forEach((group) => {
        if (group.length > 1) {
            // Bidirectional: Curve them
            group.forEach((l: any) => l.curv = 0.25);
        } else {
            // Unidirectional: Straight
            group[0].curv = 0;
        }
    });

    const linkedNodeIds = new Set();
    if (focusedNode) linkedNodeIds.add(focusedNode);

    processedLinks.forEach((l: any) => {
        const s = typeof l.source === 'object' ? l.source.id : l.source;
        const t = typeof l.target === 'object' ? l.target.id : l.target;
        linkedNodeIds.add(s);
        linkedNodeIds.add(t);
    });

    const nodes = data.nodes.filter((n: any) => linkedNodeIds.has(n.id));
    return { nodes, links: processedLinks };
  }, [data, minMentions, focusedNode]);

  return (
    <div className="flex flex-col h-full bg-[#111111]">
      <div className="p-4 bg-[#111111] border-b border-stone-800 flex justify-between items-center shadow-sm z-10">
        <div>
          <h1 className="text-xl font-bold text-[#D4AF37] font-serif">Correspondence Network</h1>
          <p className="text-sm text-stone-400 font-serif">
            {focusedNode ? (
                <>Focusing on <span className="font-bold text-white">{focusedNode}</span> (Click background to reset)</>
            ) : (
                "Who mentions whom in the archive"
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
                <label htmlFor="min-mentions" className="text-xs font-medium text-stone-400 mb-1 font-serif">
                    Min. Mentions: <span className="font-bold text-[#D4AF37]">{minMentions}</span>
                </label>
                <input 
                    id="min-mentions"
                    type="range" 
                    min="1" 
                    max="50" 
                    value={minMentions} 
                    onChange={(e) => setMinMentions(parseInt(e.target.value))}
                    disabled={!!focusedNode}
                    className="w-32 h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#D4AF37] disabled:opacity-50"
                />
            </div>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden" ref={containerRef}>
        {!loading && (
          <ForceGraph2D
            ref={fgRef}
            width={dimensions.width}
            height={dimensions.height}
            graphData={filteredData}
            nodeLabel="id"
            nodeRelSize={1}
            nodeVal={(node: any) => Math.sqrt(node.val || 1)}
            linkWidth={(link: any) => Math.sqrt(link.value || 1) * 0.5}
            // Color links by value (White with varying opacity)
            linkColor={(link: any) => {
                const opacity = Math.min(0.6, 0.1 + (link.value || 1) / 50);
                return `rgba(255, 255, 255, ${opacity})`;
            }}
            linkLabel={(link: any) => {
                const s = typeof link.source === 'object' ? link.source.id : link.source;
                const t = typeof link.target === 'object' ? link.target.id : link.target;
                return `${s} mentions ${t}: ${link.value} times`;
            }}
            linkDirectionalArrowLength={3}
            linkDirectionalArrowRelPos={1}
            linkCurvature="curv"
            backgroundColor="#111111"
            cooldownTicks={100}
            onNodeClick={(node) => setFocusedNode(node.id)}
            onBackgroundClick={() => setFocusedNode(null)}
            onNodeDragEnd={node => {
              node.fx = node.x;
              node.fy = node.y;
            }}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
                const weight = node.val || 0;
                // Min radius 6 to fit text
                const r = Math.max(6, Math.sqrt(weight) * 0.5); 
                
                ctx.beginPath();
                ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
                // Gold for Group 1 (Authors), Cool Slate Grey for Group 2
                ctx.fillStyle = node.group === 1 ? 'rgba(212, 175, 55, 0.9)' : 'rgba(71, 85, 105, 0.8)';
                ctx.fill();
                
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 0.5 / globalScale;
                ctx.stroke();

                const name = node.id;
                const fontSize = Math.min(r * 0.8, 10 / globalScale);
                ctx.font = `bold ${fontSize}px Serif`;
                
                let displayName = name;
                const textWidth = ctx.measureText(name).width;
                if (textWidth > r * 1.8) {
                    // Use initials if full name doesn't fit
                    displayName = name.split(/\s+/).map((n: string) => n[0]).join('.');
                }

                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                // Black for Gold nodes, White for Slate nodes
                ctx.fillStyle = node.group === 1 ? '#111111' : '#f5f5f4'; 
                ctx.fillText(displayName, node.x, node.y);
            }}
          />
        )}
      </div>
    </div>
  );
}