import { useState, useRef } from "react";
import axios from "axios";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";

function ThreeAICore() {
  const group = useRef();

  useFrame((state) => {
    if (group.current) {
      const targetX = (state.mouse.x * Math.PI) / 4;
      const targetY = -(state.mouse.y * Math.PI) / 4;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetY, 0.05);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <group ref={group} position={[0, -0.2, 0]} scale={1.8}>

        {/* Glowing Data Rings */}
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.4, 0.015, 16, 100]} />
          <meshStandardMaterial color="#4ade80" emissive="#22c55e" emissiveIntensity={2} transparent opacity={0.5} />
        </mesh>
        <mesh rotation={[-Math.PI / 4, Math.PI / 2, 0]}>
          <torusGeometry args={[1.4, 0.015, 16, 100]} />
          <meshStandardMaterial color="#4ade80" emissive="#22c55e" emissiveIntensity={2} transparent opacity={0.5} />
        </mesh>

        {/* Pulsating Liquid AI Brain */}
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[0.9, 64]} />
          <MeshDistortMaterial
            color="#0f172a"
            emissive="#22c55e"
            emissiveIntensity={0.4}
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.9}
            roughness={0.1}
            distort={0.4}
            speed={2.5}
          />
        </mesh>

        {/* Orbiting Intelligence Nodes */}
        <group rotation={[0, 0, Math.PI / 6]}>
          <Float speed={4} rotationIntensity={2} floatIntensity={2}>
            <mesh position={[1.5, 0, 0]}>
              <sphereGeometry args={[0.08, 32, 32]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
            </mesh>
          </Float>
        </group>

        <group rotation={[Math.PI / 2, Math.PI / 4, 0]}>
          <Float speed={3} rotationIntensity={2} floatIntensity={2}>
            <mesh position={[-1.5, 0, 0]}>
              <sphereGeometry args={[0.06, 32, 32]} />
              <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={3} />
            </mesh>
          </Float>
        </group>

        {/* Ambient Data Particles floating around the core */}
        <Sparkles count={100} scale={4} size={3} speed={0.4} opacity={0.5} color="#4ade80" />
      </group>
    </Float>
  );
}

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [docType, setDocType] = useState("Home Loan Agreement");

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", docType);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3001/api/analyze",
        formData
      );
      setData(res.data);
    } catch (err) {
      alert("Backend connection error");
    } finally {
      setLoading(false);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(data.legalAssist);
  };

  /* ===============================
     HERO PAGE
  =============================== */

  if (!data) {
    return (
      <div className="hero">
        <div className="hero-container">
          <h1>
            Veridex AI
            <span>
              AI-Powered Legal, Financial & Compliance Intelligence
            </span>
          </h1>

          <p>
            Upload any contract or loan agreement.
            Veridex AI exposes hidden costs, unfair clauses,
            regulatory violations, and gives you the leverage to act.
          </p>

          <div className="upload-glass">

            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="doc-select"
            >
              <option>Home Loan Agreement</option>
              <option>Personal Loan (NBFC)</option>
              <option>NDA / Service Contract</option>
              <option>Employment Offer Letter</option>
              <option>Rental Agreement</option>
              <option>Vendor Agreement</option>
              <option>Vehicle Loan</option>
              <option>Credit Card Agreement</option>
            </select>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button onClick={handleUpload}>
              {loading ? "Analyzing..." : "Analyze Document"}
            </button>
          </div>
        </div>

        {/* 3D Animated AI Avatar Core */}
        <div className="ai-avatar-container" style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Canvas camera={{ position: [0, 0, 6.5] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
            <pointLight position={[-10, 0, 10]} intensity={2} color="#4ade80" />
            <ThreeAICore />
            <Environment preset="city" />
          </Canvas>
        </div>

      </div>
    );
  }

  /* ===============================
     DASHBOARD
  =============================== */

  const risk = data.riskAssessment;
  const financial = data.financialResults;

  const principal = financial?.extractedTerms?.principal || 0;
  const interest = financial?.totalInterest || 0;
  const total = principal + interest || 1;
  const formattedTotal = total >= 10000000 ? (total / 10000000).toFixed(2) + 'Cr' : (total / 100000).toFixed(2) + 'L';

  const principalPercent = ((principal / total) * 100).toFixed(1);
  const interestPercent = ((interest / total) * 100).toFixed(1);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        <div className="dashboard-topbar">
          <div>
            <h2>Document Intelligence Dashboard</h2>
            <div className="doc-badge">
              {docType}
              {docType === "Home Loan Agreement" && (
                <span className="demo-badge">Demo Model Active</span>
              )}
            </div>
          </div>

          <button onClick={() => setData(null)}>
            New Analysis
          </button>
        </div>

        {/* KPI SECTION */}
        <div className="dashboard-metrics">

          <div className="dashboard-card card-hero">
            <span>Document Health Score</span>
            <h1>{risk?.riskScore}</h1>
            <p>{risk?.riskLevel}</p>
            <small>
              Combined Legal + Financial + Compliance Index
            </small>
          </div>

          {financial && (
            <>
              <div className="dashboard-card">
                <span>Total Payment</span>
                <h1>₹{financial.totalPayment.toLocaleString('en-IN')}</h1>
                <small>Full tenure payout (Principal + Interest)</small>
              </div>

              <div className="dashboard-card">
                <span>Total Interest</span>
                <h1>₹{financial.totalInterest.toLocaleString('en-IN')}</h1>
                <small>{interestPercent}% of total payout</small>
              </div>

              <div className="dashboard-card">
                <span>Financial Gap</span>
                <h1>₹{financial.rupeeGap.toLocaleString('en-IN')}</h1>
                <small>Hidden cost exposure across tenure</small>
              </div>
            </>
          )}
        </div>

        {/* CHARTS (Only if financial doc) */}
        {financial && (
          <div className="dashboard-charts">

            <div className="dashboard-card large center-chart" style={{ paddingBottom: '20px' }}>
              <h3>Health Score Visualization</h3>

              <ResponsiveContainer width="100%" height={250}>
                <RadialBarChart
                  innerRadius="80%"
                  outerRadius="100%"
                  data={[{ value: risk?.riskScore }]}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    dataKey="value"
                    fill="#bef264"
                    background={{ fill: "rgba(255,255,255,0.05)" }}
                    cornerRadius={50}
                  />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#18191c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                </RadialBarChart>
              </ResponsiveContainer>

              <div className="chart-center" style={{ top: '44%' }}>
                <h2 style={{ fontSize: '42px', margin: 0, color: '#bef264', letterSpacing: '-1px' }}>{risk?.riskScore}</h2>
                <p style={{ fontSize: '13px', color: '#a1a1aa', marginTop: '4px' }}>Score / 100</p>
              </div>

              <div className="pie-legend detailed">
                <div className="legend-item">
                  <div className="legend-title"><span className="dot neon"></span> Risk Level</div>
                  <h4 style={{ fontSize: '15px' }}>{risk?.riskLevel}</h4>
                  <small>Based on 124 clauses</small>
                </div>
                <div className="legend-item">
                  <div className="legend-title"><span className="dot gray"></span> Critical Issues</div>
                  <h4 style={{ fontSize: '15px', color: '#f87171' }}>3 Detected</h4>
                  <small>Requires review</small>
                </div>
              </div>
            </div>

            <div className="dashboard-card large center-chart" style={{ paddingBottom: '20px' }}>
              <h3>Principal vs Interest</h3>

              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Principal", value: principal },
                      { name: "Interest", value: interest }
                    ]}
                    dataKey="value"
                    innerRadius={80}
                    outerRadius={115}
                    paddingAngle={4}
                    stroke="none"
                    cornerRadius={6}
                  >
                    <Cell fill="#bef264" />
                    <Cell fill="#334155" />
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#18191c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#fff' }} formatter={(value) => '₹' + value.toLocaleString('en-IN')} />
                </PieChart>
              </ResponsiveContainer>

              <div className="chart-center" style={{ top: '44%' }}>
                <h2 style={{ fontSize: '26px' }}>₹{formattedTotal}</h2>
                <p style={{ fontSize: '13px', color: '#a1a1aa' }}>Total Loan</p>
              </div>

              <div className="pie-legend detailed">
                <div className="legend-item">
                  <div className="legend-title"><span className="dot neon"></span> Principal</div>
                  <h4>₹{principal.toLocaleString('en-IN')}</h4>
                  <small>{principalPercent}% of total</small>
                </div>
                <div className="legend-item">
                  <div className="legend-title"><span className="dot gray"></span> Interest</div>
                  <h4>₹{interest.toLocaleString('en-IN')}</h4>
                  <small>{interestPercent}% of total</small>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* LOWER SECTION */}
        <div className="dashboard-lower">

          <div className="dashboard-card">
            <h3>Compliance Summary</h3>
            <p>{data.complianceResults?.complianceSummary}</p>
          </div>

          <div className="dashboard-card">
            <h3>Negotiation Copilot</h3>
            <textarea
              rows="8"
              value={data.legalAssist}
              readOnly
            />
            <button onClick={copyEmail}>
              Copy Message
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default App;