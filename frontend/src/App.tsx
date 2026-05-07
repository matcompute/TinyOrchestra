import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Network, 
  Zap, 
  BarChart, 
  ShieldCheck, 
  Settings2,
  HardDrive,
  RefreshCcw,
  Signal
} from 'lucide-react';
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const API_BASE = 'http://localhost:8012'; // TinyOrchestra Port

const App = () => {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [nodeState, setNodeState] = useState<any>({ footprint: '128.5 KB', qActive: false });
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Mesh Coordinator Online.", "[NODE_01] Ready for Local Adaptation."]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 6000);
    return () => clearInterval(interval);
  }, []);

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 5)]);

  const fetchTelemetry = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/mesh/telemetry`);
      setTelemetry(res.data);
    } catch (err) {
      console.error("Mesh Offline");
    }
  };

  const handleQuantize = async () => {
    setProcessing(true);
    try {
      const res = await axios.post(`${API_BASE}/api/node/quantize`);
      setNodeState({ footprint: res.data.new_footprint, qActive: true });
      addLog("Int8 Quantization Applied. Memory Footprint reduced by 75%.");
    } catch (err) {
      addLog("Quantization failed.");
    } finally {
      setProcessing(false);
    }
  };

  const handleAdapt = async () => {
    setProcessing(true);
    try {
      const res = await axios.post(`${API_BASE}/api/node/adapt`, { data: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] });
      addLog(`Local Adaptation Success: Score ${res.data.adaptation_score}`);
      addLog(`Model Delta generated for Federated Sync.`);
    } catch (err) {
      addLog("On-Device learning failed.");
    } finally {
      setProcessing(false);
    }
  };

  const chartData = [
    { name: 'Standard (32-bit)', memory: 128 },
    { name: 'Quantized (8-bit)', memory: 32 }
  ];

  return (
    <div className="mesh-container">
      {/* Header */}
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="node-card" style={{ padding: '12px', display: 'flex', background: 'var(--accent-amber)' }}>
            <Cpu size={32} color="#000" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 800, color: 'var(--accent-amber)', letterSpacing: '-1px' }}>
              TINY<span style={{ color: 'white' }}>ORCHESTRA</span>
            </h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600, letterSpacing: '1px' }}>
              EDGE INTELLIGENCE & FEDERATED MESH
            </p>
          </div>
        </div>
        <div className="node-card" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
           <div className="status-dot"></div>
           <span style={{ fontSize: '12px', fontWeight: 800 }}>MESH ACTIVE</span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        {/* Node Status */}
        <div className="node-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Settings2 size={20} color="var(--accent-amber)" />
            <span style={{ fontWeight: 700, fontSize: '14px' }}>LOCAL NODE STATUS (NODE_01)</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>RAM Footprint</span>
              <span className="data-stream" style={{ padding: '4px 8px' }}>{nodeState.footprint}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Quantization</span>
              <span style={{ color: nodeState.qActive ? 'var(--accent-amber)' : 'var(--text-secondary)' }}>
                {nodeState.qActive ? 'INT8_ACTIVE' : 'NONE'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Privacy Mode</span>
              <span style={{ color: 'var(--accent-amber)' }}>DIFF_PRIVACY_ON</span>
            </div>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
             <button className="mesh-btn" onClick={handleQuantize} disabled={processing || nodeState.qActive}>
               COMPRESS
             </button>
             <button className="mesh-btn" style={{ background: '#333', color: 'white' }} onClick={handleAdapt} disabled={processing}>
               LEARN LOCAL
             </button>
          </div>
        </div>

        {/* Efficiency Chart */}
        <div className="node-card" style={{ gridColumn: 'span 2' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <BarChart size={20} color="var(--accent-amber)" />
            <span style={{ fontWeight: 700, fontSize: '14px' }}>RESOURCE EFFICIENCY (MEMORY vs ACCURACY)</span>
          </div>
          <div style={{ width: '100%', height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} label={{ value: 'RAM (KB)', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)' }} />
                <Tooltip 
                  contentStyle={{ background: '#121418', border: '1px solid var(--accent-amber)', borderRadius: '8px' }}
                />
                <Bar dataKey="memory" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 1 ? 'var(--accent-amber)' : '#444'} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mesh Intelligence */}
        <div className="node-card" style={{ gridColumn: 'span 2' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Network size={20} color="var(--accent-amber)" />
                <span style={{ fontWeight: 700, fontSize: '14px' }}>FEDERATED MESH TELEMETRY</span>
             </div>
             <div style={{ fontSize: '10px', color: 'var(--accent-amber)', fontWeight: 800 }}>AGGREGATION ENGINE v2.1</div>
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div className="node-card" style={{ background: 'rgba(255,159,0,0.05)', padding: '16px', textAlign: 'center' }}>
                 <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>NODES</div>
                 <div style={{ fontSize: '24px', fontWeight: 800 }}>{telemetry?.nodes_active || '0'}</div>
              </div>
              <div className="node-card" style={{ background: 'rgba(255,159,0,0.05)', padding: '16px', textAlign: 'center' }}>
                 <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>ACCURACY</div>
                 <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-amber)' }}>{telemetry?.global_accuracy ? `${(telemetry.global_accuracy * 100).toFixed(1)}%` : '0%'}</div>
              </div>
              <div className="node-card" style={{ background: 'rgba(255,159,0,0.05)', padding: '16px', textAlign: 'center' }}>
                 <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>BW SAVED</div>
                 <div style={{ fontSize: '24px', fontWeight: 800 }}>{telemetry?.bandwidth_saved || '0%'}</div>
              </div>
              <div className="node-card" style={{ background: 'rgba(255,159,0,0.05)', padding: '16px', textAlign: 'center' }}>
                 <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>DELTAS</div>
                 <div style={{ fontSize: '24px', fontWeight: 800 }}>{telemetry?.total_deltas_aggregated || '0'}</div>
              </div>
           </div>
        </div>

        {/* Live Logs */}
        <div className="node-card">
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Signal size={20} color="var(--accent-amber)" />
            <span style={{ fontWeight: 700, fontSize: '14px' }}>MESH ACTIVITY LOG</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {logs.map((log, i) => (
              <div key={i} className="data-stream" style={{ fontSize: '11px', opacity: 1 - (i * 0.15) }}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
