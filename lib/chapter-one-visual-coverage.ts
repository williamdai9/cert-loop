export type VisualCoverageItem = {
  id: `Figure 1.${number}` | `Table 1.${number}`;
  pdfPage: number | string;
  concept: string;
  sectionId: "musculoskeletal" | "contraction" | "neuromuscular" | "cardiovascular" | "respiratory";
  implementation: "interactive-original" | "verified-private-note" | "hybrid";
  module: string;
};

/**
 * Audited against the learner-supplied English fifth-edition PDF, pages 38-103.
 * This is a coverage/provenance register, not publisher content. Artwork rendered
 * by the site is original; supplied note figures remain in authenticated storage.
 */
export const chapterOneVisualCoverage: VisualCoverageItem[] = [
  { id:"Figure 1.1", pdfPage:41, concept:"Axial/appendicular skeleton and major landmarks", sectionId:"musculoskeletal", implementation:"verified-private-note", module:"Section note figure: skeleton" },
  { id:"Figure 1.2", pdfPage:45, concept:"Anterior/posterior major skeletal musculature", sectionId:"musculoskeletal", implementation:"interactive-original", module:"Muscle Landmark Board" },
  { id:"Figure 1.3", pdfPage:46, concept:"Whole muscle, fascicle, fiber, connective tissue, and tendon", sectionId:"musculoskeletal", implementation:"hybrid", module:"Structure Explorer + supplied hierarchy figure" },
  { id:"Figure 1.4", pdfPage:47, concept:"Motor neuron and innervated muscle-fiber mosaic", sectionId:"neuromuscular", implementation:"interactive-original", module:"Motor Unit Mosaic" },
  { id:"Figure 1.5", pdfPage:48, concept:"Muscle-fiber cross-section, T-tubule, SR, and myofibrils", sectionId:"contraction", implementation:"hybrid", module:"Signal Sequence + supplied muscle-fiber figure" },
  { id:"Figure 1.6", pdfPage:50, concept:"Myofilament and sarcomere organization", sectionId:"contraction", implementation:"hybrid", module:"Sarcomere States + supplied sliding-filament figure" },
  { id:"Figure 1.7", pdfPage:52, concept:"Sarcomere overlap across length states", sectionId:"contraction", implementation:"interactive-original", module:"Three-state Sarcomere Compare" },
  { id:"Figure 1.8", pdfPage:58, concept:"Twitch, summation, unfused and fused tetanus", sectionId:"neuromuscular", implementation:"interactive-original", module:"Firing Rate Studio" },
  { id:"Figure 1.9", pdfPage:60, concept:"Fiber phenotype and size-principle recruitment", sectionId:"neuromuscular", implementation:"interactive-original", module:"Recruitment Studio" },
  { id:"Figure 1.10", pdfPage:66, concept:"Muscle spindle, GTO, and proprioceptive feedback", sectionId:"neuromuscular", implementation:"interactive-original", module:"Sensor Comparison" },
  { id:"Figure 1.11", pdfPage:71, concept:"Four chambers, four valves, and closed blood-flow route", sectionId:"cardiovascular", implementation:"interactive-original", module:"Blood-flow Trace" },
  { id:"Figure 1.12", pdfPage:72, concept:"Cardiac electrical conduction pathway", sectionId:"cardiovascular", implementation:"interactive-original", module:"Conduction + ECG Studio" },
  { id:"Figure 1.13", pdfPage:74, concept:"P wave, QRS complex, and T wave", sectionId:"cardiovascular", implementation:"interactive-original", module:"Conduction + ECG Studio" },
  { id:"Figure 1.14", pdfPage:75, concept:"Resting blood-volume distribution", sectionId:"cardiovascular", implementation:"interactive-original", module:"Blood-volume Distribution" },
  { id:"Figure 1.15", pdfPage:80, concept:"Air route through the respiratory system", sectionId:"respiratory", implementation:"interactive-original", module:"Air-route Sequence" },
  { id:"Figure 1.16", pdfPage:91, concept:"Tidal volume and dead-space partition", sectionId:"respiratory", implementation:"interactive-original", module:"Tidal-volume Lab" },
  { id:"Figure 1.17", pdfPage:92, concept:"Pulmonary and tissue gas-pressure gradients", sectionId:"respiratory", implementation:"interactive-original", module:"Gas-gradient Studio" },
  { id:"Table 1.1", pdfPage:"61-62", concept:"Type I, IIa, and IIx characteristic matrix", sectionId:"neuromuscular", implementation:"interactive-original", module:"Fiber Matrix" },
  { id:"Table 1.2", pdfPage:"63-64", concept:"Relative fiber-type involvement by event demand", sectionId:"neuromuscular", implementation:"interactive-original", module:"Sport Demand Predictor" },
];
