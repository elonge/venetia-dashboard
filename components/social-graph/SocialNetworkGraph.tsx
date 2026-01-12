'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PEOPLE_IMAGES } from '@/constants';
import { Button } from '@/components/ui/button';
import { Search, UserPlus } from 'lucide-react';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-stone-500">Loading Network Graph...</div>
});

interface SocialNetworkGraphProps {
  onSearchMode?: (name: string) => void;
}

export default function SocialNetworkGraph({ onSearchMode }: SocialNetworkGraphProps) {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [minMentions, setMinMentions] = useState(3);
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [bioData, setBioData] = useState<any | null>(null);
  const [bioLoading, setBioLoading] = useState(false);

  useEffect(() => {
    fetch('/api/social-graph/network')
      .then(res => {
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
        return res.json();
      })
      .then(graphData => {
        if (!graphData.nodes || !Array.isArray(graphData.nodes)) {
            console.error("Invalid data format received:", graphData);
            setData({ nodes: [], links: [] }); 
        } else {
            console.log("Loaded graph data:", graphData);
            setData(graphData);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load graph data", err);
        setData({ nodes: [], links: [] });
        setLoading(false);
      });
  }, []);

  // Configure forces when graph is ready
  useEffect(() => {
    if (fgRef.current) {
      // Force nodes apart further - increased repulsion from -300 to -500
      fgRef.current.d3Force('charge').strength(-500);
      // Add collision force to prevent overlap
      fgRef.current.d3Force('collide', (node: any) => Math.max(10, Math.sqrt(node.val || 1) * 2));
      // Increase link distance slightly to spread things out
      fgRef.current.d3Force('link').distance(50);
    }
  }, [loading, focusedNode]);

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
        // Focus mode: Show ALL links connected to the focused node
        links = data.links.filter((l: any) => {
            const s = typeof l.source === 'object' ? l.source.id : l.source;
            const t = typeof l.target === 'object' ? l.target.id : l.target;
            return s === focusedNode || t === focusedNode;
        });
    } else { 
        // Normal mode: Filter by weight
        links = data.links;
    }
    links = links.filter((l: any) => l.value >= minMentions);

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

  const handleNodeClick = async (node: any) => {
    if (selectedNode?.id === node.id) {
        // Deselect if already selected
        setSelectedNode(null);
        setBioData(null);
        return;
    }
    
    setSelectedNode(node);
    setBioLoading(true);
    setBioData(null); // Clear previous bio

    try {
        const res = await fetch(`/api/social-graph/people/bio?name=${encodeURIComponent(node.id)}`);
        if (res.ok) {
            const bio = await res.json();
            setBioData(bio);
        } else {
            setBioData(null);
        }
    } catch (err) {
        console.error("Failed to fetch bio", err);
        setBioData(null);
    } finally {
        setBioLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#111111] rounded-lg overflow-hidden shadow-2xl border border-stone-800 relative">
      <div className="p-4 bg-[#111111] border-b border-stone-800 flex justify-between items-center shadow-sm z-10">
        <div>
          <h2 className="text-lg font-bold text-[#D4AF37] font-serif">Correspondence Network - Who mentioned who</h2>
          <p className="text-xs text-stone-400 font-serif">
            {focusedNode ? (
                <>Focusing on <span className="font-bold text-white">{focusedNode}</span> (Click background to reset)</>
            ) : (
                "Click a person to see details"
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
                <label htmlFor="min-mentions" className="text-[10px] font-medium text-stone-400 mb-1 font-serif">
                    Min. Mentions: <span className="font-bold text-[#D4AF37]">{minMentions}</span>
                </label>
                <input 
                    id="min-mentions"
                    type="range" 
                    min="1" 
                    max="50" 
                    value={minMentions} 
                    onChange={(e) => setMinMentions(parseInt(e.target.value))}
                    className="w-24 h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#D4AF37] disabled:opacity-50"
                />
            </div>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden bg-[#111111]" ref={containerRef} style={{ minHeight: '600px' }}>
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
            onNodeClick={handleNodeClick}
            onBackgroundClick={() => {
                setFocusedNode(null);
                setSelectedNode(null);
            }}
            onNodeHover={(node: any) => {
                document.body.style.cursor = node ? 'pointer' : 'default';
                setHoveredNodeId(node ? node.id : null);
            }}
            onNodeDragEnd={node => {
              node.fx = node.x;
              node.fy = node.y;
            }}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
                const weight = node.val || 0;
                // Min radius 5, multiplier 0.42 (approx 15% decrease from 6 and 0.5)
                const r = Math.max(5, Math.sqrt(weight) * 0.42); 
                const isHovered = node.id === hoveredNodeId;
                const isSelected = selectedNode?.id === node.id;
                
                ctx.beginPath();
                ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
                // Gold for Group 1 (Authors), Cool Slate Grey for Group 2
                ctx.fillStyle = node.group === 1 ? 'rgba(212, 175, 55, 0.9)' : 'rgba(71, 85, 105, 0.8)';
                ctx.fill();
                
                // Stroke style
                if (isSelected) {
                    ctx.strokeStyle = '#D4AF37'; // Gold selection
                    ctx.lineWidth = 2 / globalScale;
                } else if (isHovered) {
                    ctx.strokeStyle = '#FFFFFF'; // White hover
                    ctx.lineWidth = 1.5 / globalScale;
                } else {
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.lineWidth = 0.5 / globalScale;
                }
                ctx.stroke();
                
                // Hover indicator ring
                if (isHovered && !isSelected) {
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, r + 2, 0, 2 * Math.PI, false);
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                    ctx.lineWidth = 0.5 / globalScale;
                    ctx.stroke();
                }

                const name = node.id;
                const fontSize = Math.min(r * 0.8, 10 / globalScale);
                ctx.font = `bold ${fontSize}px Serif`;
                
                let displayName = name;
                const textWidth = ctx.measureText(name).width;
                if (textWidth > r * 1.8) {
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

        {/* Person Card */}
        {selectedNode && (
            <div 
                className="absolute top-4 right-4 w-72 bg-[#F4F1EA] border border-[#D4AF37] rounded-lg shadow-[0px_10px_30px_rgba(0,0,0,0.5)] p-4 z-50 animate-in fade-in slide-in-from-right-4 duration-300"
            >
                <div className="flex items-start gap-4 mb-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4AF37] flex-shrink-0 bg-white">
                        {PEOPLE_IMAGES[selectedNode.id as keyof typeof PEOPLE_IMAGES] ? (
                            <img 
                                src={PEOPLE_IMAGES[selectedNode.id as keyof typeof PEOPLE_IMAGES]} 
                                alt={selectedNode.id}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#D4AF37] font-bold text-xl">
                                {selectedNode.id[0]}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-[#111111] font-bold font-serif leading-tight">{selectedNode.id}</h3>
                        <p className="text-[10px] text-stone-600 uppercase tracking-wider mt-1">
                            {selectedNode.group === 1 ? 'Primary Author' : 'Mentioned Person'}
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="text-xs text-[#111111] font-serif leading-relaxed">
                        {bioLoading ? (
                            <div className="animate-pulse space-y-1">
                                <div className="h-2 bg-stone-300 rounded w-full"></div>
                                <div className="h-2 bg-stone-300 rounded w-5/6"></div>
                                <div className="h-2 bg-stone-300 rounded w-4/6"></div>
                            </div>
                        ) : bioData?.bio || bioData?.description || "No biography available for this person."}
                    </div>

                    <div className="pt-2 border-t border-stone-300 flex flex-col gap-2">
                        {focusedNode !== selectedNode.id ? (
                            <Button 
                                size="sm" 
                                className="w-full h-8 text-[10px] bg-[#D4AF37] hover:bg-[#B8962E] text-[#111111] font-bold"
                                onClick={() => {
                                    setFocusedNode(selectedNode.id);
                                    // Keep selectedNode open
                                }}
                            >
                                <UserPlus className="w-3 h-3 mr-1.5" />
                                Focus on Correspondence
                            </Button>
                        ) : (
                            <Button 
                                size="sm" 
                                variant="outline"
                                className="w-full h-8 text-[10px] border-stone-400 text-[#111111] hover:bg-stone-200"
                                onClick={() => {
                                    if (onSearchMode) onSearchMode(selectedNode.id);
                                }}
                            >
                                <Search className="w-3 h-3 mr-1.5" />
                                See mentions in Search Mode
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

