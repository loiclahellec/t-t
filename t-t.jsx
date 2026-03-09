import { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";

const DATA = {
  nodes: [
    // Think Tanks - Major
    { id: "bruegel", label: "Bruegel", type: "think_tank", budget: 7.8, influence: 1, model: "Cotisations membres (70%)", focus: "Macroéconomie, gouvernance", political: "Pro-intégration, modéré", details: "Fondé en 2005 par Jean Pisani-Ferry. Modèle diversifié et non-fléché. Rôle clé dans l'Union bancaire.", x_pol: 0.6, y_pol: 0.5 },
    { id: "ceps", label: "CEPS", type: "think_tank", budget: 6.2, influence: 2, model: "Dépendant financements UE", focus: "Marché unique, régulation", political: "Pro-fédéraliste, pro-régulation", details: "Fondé en 1983, l'un des premiers think tanks bruxellois. Créé pour accompagner le marché unique.", x_pol: 0.7, y_pol: 0.7 },
    { id: "epc", label: "EPC", type: "think_tank", budget: 5.7, influence: 3, model: "Dépendant financements UE + CERV (5%)", focus: "Politique européenne généraliste", political: "Pro-intégration", details: "European Policy Centre, fondé en 1996. Cible principale : la Commission européenne.", x_pol: 0.65, y_pol: 0.6 },
    { id: "mcc", label: "MCC Brussels", type: "think_tank", budget: 6.0, influence: 4, model: "100% financement hongrois", focus: "Liberté d'expression, médias, anti-régulation", political: "Eurosceptique, conservateur", details: "Antenne bruxelloise du Mathias Corvinus Collegium. Ouvert en 2023. 3e think tank le mieux doté. Équipe à forte composante britannique, proche de Reform UK.", x_pol: 0.2, y_pol: 0.3 },
    { id: "friends", label: "Friends of Europe", type: "think_tank", budget: 3.5, influence: 5, model: "Mix diversifié", focus: "Questions européennes transversales", political: "Pro-intégration", details: "Créé en 1999, reflète l'élargissement de l'UE et sa politisation.", x_pol: 0.6, y_pol: 0.55 },
    { id: "delors", label: "Institut Jacques Delors", type: "think_tank", budget: 2.5, influence: 6, model: "17% CERV + diversifié", focus: "Intégration européenne, avenir de l'UE", political: "Fédéraliste", details: "Présent à Paris et Berlin. Principal centre français consacré à l'UE. Fragilisé par la réorientation CERV.", x_pol: 0.8, y_pol: 0.65 },
    { id: "ecipe", label: "ECIPE", type: "think_tank", budget: 2.0, influence: 7, model: "Fonds suédois (public + privé)", focus: "Commerce, déréglementation", political: "Pro-libéralisation, libre-échange", details: "European Centre for International Political Economy. Vues prononcées en faveur de la déréglementation.", x_pol: 0.4, y_pol: 0.2 },
    { id: "cerre", label: "CERRE", type: "think_tank", budget: 2.0, influence: 8, model: "Cotisations membres", focus: "Régulation numérique, énergie", political: "Modéré", details: "Centre on Regulation in Europe. Modèle inspiré de Bruegel.", x_pol: 0.5, y_pol: 0.45 },
    { id: "ieep", label: "IEEP", type: "think_tank", budget: 1.5, influence: 9, model: "Projets + fondations", focus: "Environnement, climat", political: "Pro-régulation environnementale", details: "Institute for European Environmental Policy. Montée en puissance avec les sujets climatiques.", x_pol: 0.65, y_pol: 0.75 },
    { id: "lisbon", label: "Lisbon Council", type: "think_tank", budget: 1.5, influence: 10, model: "Mix entreprises + projets", focus: "Numérique, innovation", political: "Pro-innovation", details: "Spécialisé sur les questions numériques et d'innovation.", x_pol: 0.45, y_pol: 0.4 },
    { id: "reimagine", label: "Re-imagine Europa", type: "think_tank", budget: 1.2, influence: 13, model: "1-2 fondations principales", focus: "Avenir de l'Europe", political: "Pro-intégration", details: "Principalement financé par la Bill & Melinda Gates Foundation.", x_pol: 0.7, y_pol: 0.6 },
    { id: "cfg", label: "Centre for Future Generations", type: "think_tank", budget: 1.2, influence: 14, model: "2 fondations néerlandaises", focus: "Générations futures, durabilité", political: "Progressiste", details: "Dépendant principalement de deux fondations néerlandaises.", x_pol: 0.65, y_pol: 0.7 },
    { id: "big", label: "BIG", type: "think_tank", budget: 1.0, influence: 12, model: "Cotisations membres", focus: "Géopolitique, défense", political: "Pro-intégration, souverainiste européen", details: "Brussels Institute for Geopolitics. Créé en 2023 par Luuk van Middelaar. Modèle inspiré de Bruegel.", x_pol: 0.6, y_pol: 0.55 },
    { id: "feps", label: "FEPS", type: "think_tank", budget: 2.5, influence: 11, model: "Parti S&D", focus: "Politique sociale, progressisme", political: "Social-démocrate", details: "Foundation for European Progressive Studies. Liée au Parti socialiste européen.", x_pol: 0.75, y_pol: 0.8 },
    { id: "martens", label: "Wilfried Martens Centre", type: "think_tank", budget: 2.0, influence: 11, model: "Parti PPE", focus: "Centre-droit, valeurs chrétiennes-démocrates", political: "Centre-droit (PPE)", details: "Fondation liée au Parti populaire européen.", x_pol: 0.55, y_pol: 0.4 },
    { id: "elf", label: "European Liberal Forum", type: "think_tank", budget: 1.5, influence: 12, model: "Parti Renew", focus: "Libéralisme, droits individuels", political: "Libéral", details: "Fondation liée à Renew Europe.", x_pol: 0.45, y_pol: 0.3 },
    { id: "ices", label: "ICES", type: "think_tank", budget: 0.5, influence: 16, model: "Financement chinois", focus: "Relations Chine-Europe", political: "Pro-dialogue avec Pékin", details: "Institute for China-Europe Studies. Représente certaines idées chinoises dans les discussions bruxelloises.", x_pol: 0.4, y_pol: 0.5 },
    { id: "carnegie", label: "Carnegie Europe", type: "think_tank", budget: 4.0, influence: 5, model: "Dotation américaine", focus: "Géopolitique, relations internationales", political: "Atlantiste, libéral-internationaliste", details: "Antenne bruxelloise du Carnegie Endowment. Think tank américain très bien doté.", x_pol: 0.55, y_pol: 0.5 },
    { id: "gmf", label: "German Marshall Fund", type: "think_tank", budget: 3.5, influence: 6, model: "Dotation américaine + fondations", focus: "Relations transatlantiques", political: "Atlantiste", details: "Présence à Bruxelles. Rôle historique dans les liens transatlantiques.", x_pol: 0.5, y_pol: 0.45 },
    { id: "tax_found", label: "Tax Foundation", type: "think_tank", budget: 2.0, influence: 13, model: "Entreprises US + fortunes conservatrices", focus: "Fiscalité, libre marché", political: "Conservateur économique", details: "Financée par des entreprises américaines. L'une des rares voix conservatrices historiques à Bruxelles.", x_pol: 0.3, y_pol: 0.15 },

    // Funders - US Foundations
    { id: "osf", label: "Open Society (Soros)", type: "funder_us_foundation", details: "Investissements Europe/Asie Centrale passés de 209M à 83M€ entre 2022 et 2024. Reflux significatif." },
    { id: "gates", label: "Bill & Melinda Gates Foundation", type: "funder_us_foundation", details: "L'un des principaux bailleurs. Tendance progressiste sur les sujets climatiques et sociaux." },
    { id: "breakthrough", label: "Breakthrough Energy (Gates)", type: "funder_us_foundation", details: "Fermeture du bureau européen en 2025. Impact durable sur le financement de la recherche." },

    // Funders - US Tech
    { id: "google", label: "Google", type: "funder_tech", details: "Principal bailleur privé, ~1M€/an. Intérêt lié au DSA, DMA, AI Act." },
    { id: "meta", label: "Meta", type: "funder_tech", details: "Présent dans le financement. Enjeux : DSA, DMA, régulation des plateformes." },
    { id: "microsoft", label: "Microsoft", type: "funder_tech", details: "Financement régulier. Enjeux : Cloud Act, AI Act, régulation numérique." },
    { id: "apple", label: "Apple", type: "funder_tech", details: "Contributeur significatif. Enjeux : DMA, interopérabilité." },
    { id: "amazon", label: "Amazon", type: "funder_tech", details: "Contributeur régulier. Enjeux : DSA, DMA, Cloud Act." },

    // Funders - EU Institutions
    { id: "cerv", label: "Programme CERV", type: "funder_eu", details: "279M€ (2026), 299M€ (2027). Sous pression politique et budgétaire. Réorientation en cours." },
    { id: "horizons", label: "Programme Horizons", type: "funder_eu", details: "Financements pluriannuels pour la recherche fondamentale." },

    // Funders - States
    { id: "hungary", label: "État hongrois / MOL", type: "funder_state", details: "Principal animateur de la sphère eurosceptique. Finance MCC via fondation détenant des parts dans MOL." },
    { id: "france", label: "État français (MEAE, BdF, CDC)", type: "funder_state", details: "~1M€ dans les 20 TT les plus visibles. Présence non-négligeable mais moins systématique que l'Allemagne." },
    { id: "sweden", label: "État suédois", type: "funder_state", details: "Finance particulièrement ECIPE. Présence non-négligeable." },
    { id: "netherlands", label: "Fondations néerlandaises", type: "funder_state", details: "Financent notamment le Centre for Future Generations." },

    // Funders - German Foundations
    { id: "adenauer", label: "Konrad Adenauer Stiftung", type: "funder_de_foundation", details: "Fondation politique CDU. Branche bruxelloise. Relais d'influence allemand structurant." },
    { id: "ebert", label: "Friedrich Ebert Stiftung", type: "funder_de_foundation", details: "Fondation politique SPD. Présence bruxelloise." },
    { id: "naumann", label: "Friedrich Naumann Stiftung", type: "funder_de_foundation", details: "Fondation politique FDP (libérale). Branche bruxelloise." },
    { id: "boll", label: "Heinrich Böll Stiftung", type: "funder_de_foundation", details: "Fondation politique Verts. Branche bruxelloise." },
    { id: "bertelsmann", label: "Bertelsmann Stiftung", type: "funder_de_foundation", details: "Fondation privée allemande. Acteur structurant." },
    { id: "mercator", label: "Mercator Stiftung", type: "funder_de_foundation", details: "Fondation privée allemande, sujets climatiques et européens." },
    { id: "bosch", label: "Robert Bosch Stiftung", type: "funder_de_foundation", details: "Fondation privée allemande." },

    // Funders - Energy
    { id: "edf_engie", label: "EDF / Engie / Total", type: "funder_energy", details: "Principaux énergéticiens français présents dans le financement des TT bruxellois." },
    { id: "shell_exxon", label: "Shell / Exxon / ENI / Repsol", type: "funder_energy", details: "Secteur énergie bien représenté, proportionnel à l'impact de la norme européenne." },

    // Funders - Finance
    { id: "finance", label: "BlackRock / Mastercard / Moody's", type: "funder_finance", details: "Secteur financier actif. Investissement proportionnel à l'importance de la régulation UE." },

    // Funders - China
    { id: "china_mission", label: "Mission de Chine auprès de l'UE", type: "funder_china", details: "Dizaines de milliers d'euros à certains instituts. Niveau modeste mais non-négligeable." },
    { id: "huawei_shein", label: "Huawei / Shein", type: "funder_china", details: "Financent certains instituts traitant du numérique." },

    // Funders - European Climate
    { id: "ecf", label: "European Climate Foundation", type: "funder_us_foundation", details: "Fondation à engagement progressiste, influence pro-action climatique." },
  ],
  links: [
    // Bruegel connections
    { source: "google", target: "bruegel", strength: 2 },
    { source: "meta", target: "bruegel", strength: 1 },
    { source: "microsoft", target: "bruegel", strength: 1 },
    { source: "france", target: "bruegel", strength: 2 },
    { source: "huawei_shein", target: "bruegel", strength: 1 },
    { source: "horizons", target: "bruegel", strength: 1 },
    { source: "edf_engie", target: "bruegel", strength: 1 },
    { source: "shell_exxon", target: "bruegel", strength: 1 },
    { source: "finance", target: "bruegel", strength: 1 },

    // CEPS connections
    { source: "cerv", target: "ceps", strength: 3 },
    { source: "horizons", target: "ceps", strength: 2 },
    { source: "google", target: "ceps", strength: 1 },

    // EPC connections
    { source: "cerv", target: "epc", strength: 2 },
    { source: "horizons", target: "epc", strength: 2 },
    { source: "china_mission", target: "epc", strength: 1 },
    { source: "huawei_shein", target: "epc", strength: 1 },
    { source: "google", target: "epc", strength: 1 },

    // MCC Brussels
    { source: "hungary", target: "mcc", strength: 5 },

    // Friends of Europe
    { source: "china_mission", target: "friends", strength: 1 },
    { source: "google", target: "friends", strength: 1 },
    { source: "cerv", target: "friends", strength: 1 },

    // Jacques Delors
    { source: "cerv", target: "delors", strength: 3 },
    { source: "france", target: "delors", strength: 2 },

    // ECIPE
    { source: "sweden", target: "ecipe", strength: 4 },

    // CERRE
    { source: "google", target: "cerre", strength: 2 },
    { source: "huawei_shein", target: "cerre", strength: 1 },
    { source: "meta", target: "cerre", strength: 1 },
    { source: "apple", target: "cerre", strength: 1 },

    // IEEP
    { source: "ecf", target: "ieep", strength: 2 },
    { source: "horizons", target: "ieep", strength: 1 },

    // Lisbon Council
    { source: "google", target: "lisbon", strength: 2 },
    { source: "huawei_shein", target: "lisbon", strength: 1 },
    { source: "microsoft", target: "lisbon", strength: 1 },

    // Re-imagine Europa
    { source: "gates", target: "reimagine", strength: 4 },

    // Centre for Future Generations
    { source: "netherlands", target: "cfg", strength: 4 },

    // BIG
    { source: "france", target: "big", strength: 1 },

    // FEPS
    { source: "ebert", target: "feps", strength: 2 },
    { source: "cerv", target: "feps", strength: 1 },

    // Martens
    { source: "adenauer", target: "martens", strength: 2 },
    { source: "cerv", target: "martens", strength: 1 },

    // ELF
    { source: "naumann", target: "elf", strength: 2 },

    // ICES
    { source: "china_mission", target: "ices", strength: 3 },

    // Carnegie
    { source: "osf", target: "carnegie", strength: 1 },
    { source: "gates", target: "carnegie", strength: 1 },

    // GMF
    { source: "osf", target: "gmf", strength: 2 },
    { source: "gates", target: "gmf", strength: 1 },

    // Tax Foundation
    { source: "tax_found", target: "tax_found", strength: 0 }, // placeholder removed below

    // General foundation links
    { source: "osf", target: "epc", strength: 1 },
    { source: "osf", target: "friends", strength: 1 },
    { source: "gates", target: "friends", strength: 1 },
    { source: "bertelsmann", target: "ceps", strength: 1 },
    { source: "mercator", target: "ieep", strength: 1 },
    { source: "bosch", target: "big", strength: 1 },
    { source: "ecf", target: "delors", strength: 1 },
    { source: "edf_engie", target: "ceps", strength: 1 },
    { source: "france", target: "feps", strength: 1 },
    { source: "amazon", target: "ceps", strength: 1 },
    { source: "finance", target: "ceps", strength: 1 },
    { source: "finance", target: "epc", strength: 1 },
    { source: "breakthrough", target: "reimagine", strength: 1 },
    { source: "boll", target: "ieep", strength: 1 },
  ].filter(l => l.source !== l.target),
};

const TYPE_CONFIG = {
  think_tank: { color: "#E8DCC8", label: "Think Tank", ring: "#C4B69C" },
  funder_us_foundation: { color: "#5B8CDB", label: "Fondation US", ring: "#4A73B8" },
  funder_tech: { color: "#7B5EA7", label: "Big Tech US", ring: "#6A4F90" },
  funder_eu: { color: "#D4A843", label: "Institutions UE", ring: "#B89035" },
  funder_state: { color: "#4A9E7D", label: "États membres", ring: "#3D8568" },
  funder_de_foundation: { color: "#C7654A", label: "Fondations allemandes", ring: "#A8543D" },
  funder_energy: { color: "#D18A3A", label: "Énergie", ring: "#B07530" },
  funder_finance: { color: "#6B9EA8", label: "Finance", ring: "#5A8690" },
  funder_china: { color: "#C94C4C", label: "Acteurs chinois", ring: "#A83D3D" },
};

export default function ThinkTankGraph() {
  const svgRef = useRef(null);
  const simRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [dimensions, setDimensions] = useState({ w: 960, h: 700 });
  const [activeNode, setActiveNode] = useState(null);

  const getNodeRadius = useCallback((d) => {
    if (d.type === "think_tank") return Math.max(8, (d.budget || 1) * 4.2);
    return 7;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const w = Math.min(window.innerWidth - 40, 1200);
      const h = Math.min(window.innerHeight - 100, 780);
      setDimensions({ w, h });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const { w, h } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const defs = svg.append("defs");

    // Glow filter
    const glow = defs.append("filter").attr("id", "glow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
    glow.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "blur");
    glow.append("feMerge").selectAll("feMergeNode").data(["blur", "SourceGraphic"]).join("feMergeNode").attr("in", d => d);

    const nodes = DATA.nodes.map(d => ({ ...d }));
    const links = DATA.links.map(d => ({ ...d }));

    const g = svg.append("g");

    // Zoom
    const zoom = d3.zoom().scaleExtent([0.3, 3]).on("zoom", (e) => g.attr("transform", e.transform));
    svg.call(zoom);

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(d => 90 - d.strength * 6).strength(d => 0.15 + d.strength * 0.04))
      .force("charge", d3.forceManyBody().strength(d => d.type === "think_tank" ? -280 : -150))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collision", d3.forceCollide().radius(d => getNodeRadius(d) + 8))
      .force("x", d3.forceX(w / 2).strength(0.04))
      .force("y", d3.forceY(h / 2).strength(0.04));

    simRef.current = simulation;

    const linkGroup = g.append("g");
    const linkElements = linkGroup.selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#555")
      .attr("stroke-opacity", d => 0.15 + d.strength * 0.1)
      .attr("stroke-width", d => 0.5 + d.strength * 0.6);

    const nodeGroup = g.append("g");
    const nodeElements = nodeGroup.selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(d3.drag()
        .on("start", (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on("end", (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; })
      );

    // Outer ring for think tanks
    nodeElements.filter(d => d.type === "think_tank")
      .append("circle")
      .attr("r", d => getNodeRadius(d) + 3)
      .attr("fill", "none")
      .attr("stroke", d => TYPE_CONFIG[d.type]?.ring || "#888")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.5)
      .attr("stroke-dasharray", "3,2");

    nodeElements.append("circle")
      .attr("r", d => getNodeRadius(d))
      .attr("fill", d => TYPE_CONFIG[d.type]?.color || "#888")
      .attr("stroke", "#1a1a2e")
      .attr("stroke-width", 1.2)
      .attr("opacity", 0.92);

    // Labels
    nodeElements.append("text")
      .text(d => d.label)
      .attr("dy", d => getNodeRadius(d) + 13)
      .attr("text-anchor", "middle")
      .attr("fill", "#c8c0b4")
      .attr("font-size", d => d.type === "think_tank" ? "9.5px" : "8px")
      .attr("font-family", "'DM Sans', sans-serif")
      .attr("font-weight", d => d.type === "think_tank" ? "600" : "400")
      .attr("opacity", 0.85)
      .attr("pointer-events", "none");

    // Hover and click handlers stored for updates
    const updateVisibility = (hoveredId, selType) => {
      const connectedNodes = new Set();
      if (hoveredId) {
        connectedNodes.add(hoveredId);
        links.forEach(l => {
          const sId = typeof l.source === "object" ? l.source.id : l.source;
          const tId = typeof l.target === "object" ? l.target.id : l.target;
          if (sId === hoveredId) connectedNodes.add(tId);
          if (tId === hoveredId) connectedNodes.add(sId);
        });
      }

      nodeElements.select("circle:last-of-type")
        .transition().duration(200)
        .attr("opacity", d => {
          if (selType && d.type !== selType && d.type !== "think_tank") return 0.12;
          if (hoveredId && !connectedNodes.has(d.id)) return 0.12;
          return 0.92;
        });

      nodeElements.selectAll("circle:first-of-type")
        .transition().duration(200)
        .attr("stroke-opacity", d => {
          if (hoveredId && !connectedNodes.has(d.id)) return 0.08;
          return 0.5;
        });

      nodeElements.select("text")
        .transition().duration(200)
        .attr("opacity", d => {
          if (selType && d.type !== selType && d.type !== "think_tank") return 0.1;
          if (hoveredId && !connectedNodes.has(d.id)) return 0.1;
          return 0.85;
        });

      linkElements
        .transition().duration(200)
        .attr("stroke-opacity", d => {
          const sId = typeof d.source === "object" ? d.source.id : d.source;
          const tId = typeof d.target === "object" ? d.target.id : d.target;
          if (selType) {
            const sNode = nodes.find(n => n.id === sId);
            const tNode = nodes.find(n => n.id === tId);
            if (sNode?.type !== selType && tNode?.type !== selType && sNode?.type !== "think_tank" && tNode?.type !== "think_tank") return 0.02;
            if (sNode?.type !== selType && tNode?.type !== selType) return 0.04;
          }
          if (hoveredId) {
            if (sId === hoveredId || tId === hoveredId) return 0.6 + d.strength * 0.08;
            return 0.02;
          }
          return 0.15 + d.strength * 0.1;
        })
        .attr("stroke", d => {
          const sId = typeof d.source === "object" ? d.source.id : d.source;
          const tId = typeof d.target === "object" ? d.target.id : d.target;
          if (hoveredId && (sId === hoveredId || tId === hoveredId)) {
            const other = sId === hoveredId ? tId : sId;
            const otherNode = nodes.find(n => n.id === other);
            return TYPE_CONFIG[otherNode?.type]?.color || "#aaa";
          }
          return "#555";
        });
    };

    nodeElements
      .on("mouseenter", (e, d) => {
        setHovered(d);
        updateVisibility(d.id, selectedType);
        d3.select(e.currentTarget).select("circle:last-of-type")
          .transition().duration(150)
          .attr("r", getNodeRadius(d) * 1.25)
          .attr("filter", "url(#glow)");
      })
      .on("mouseleave", (e, d) => {
        setHovered(null);
        updateVisibility(null, selectedType);
        d3.select(e.currentTarget).select("circle:last-of-type")
          .transition().duration(150)
          .attr("r", getNodeRadius(d))
          .attr("filter", null);
      })
      .on("click", (e, d) => {
        setActiveNode(prev => prev?.id === d.id ? null : d);
      });

    simulation.on("tick", () => {
      linkElements
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      nodeElements.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Initial zoom to fit
    setTimeout(() => {
      svg.transition().duration(800).call(zoom.transform, d3.zoomIdentity.translate(w * 0.05, h * 0.05).scale(0.9));
    }, 1500);

    return () => simulation.stop();
  }, [dimensions, getNodeRadius]);

  // Handle filter changes
  useEffect(() => {
    if (!svgRef.current) return;
    // We'll re-trigger the visibility on type change via re-render cue
  }, [selectedType]);

  const connectedToHovered = new Set();
  if (hovered) {
    connectedToHovered.add(hovered.id);
    DATA.links.forEach(l => {
      const sId = typeof l.source === "object" ? l.source.id : l.source;
      const tId = typeof l.target === "object" ? l.target.id : l.target;
      if (sId === hovered.id) connectedToHovered.add(tId);
      if (tId === hovered.id) connectedToHovered.add(sId);
    });
  }

  const displayNode = activeNode || hovered;

  const legendTypes = Object.entries(TYPE_CONFIG);

  return (
    <div style={{
      background: "#12121f",
      minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif",
      color: "#c8c0b4",
      position: "relative",
      overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        padding: "20px 28px 8px",
        borderBottom: "1px solid rgba(200,192,180,0.08)",
        position: "relative",
        zIndex: 10,
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "22px",
          fontWeight: 700,
          color: "#e8dcc8",
          margin: 0,
          letterSpacing: "0.3px",
        }}>
          L'Écosystème des Think Tanks à Bruxelles
        </h1>
        <p style={{
          fontSize: "12px",
          color: "#8a8278",
          margin: "4px 0 0",
          fontWeight: 300,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
        }}>
          Cartographie des dynamiques de financement et d'influence
        </p>
      </div>

      {/* Legend + Filter */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        padding: "10px 28px",
        position: "relative",
        zIndex: 10,
      }}>
        <button
          onClick={() => setSelectedType(null)}
          style={{
            background: !selectedType ? "rgba(232,220,200,0.15)" : "rgba(232,220,200,0.04)",
            border: `1px solid ${!selectedType ? "rgba(232,220,200,0.3)" : "rgba(232,220,200,0.08)"}`,
            color: !selectedType ? "#e8dcc8" : "#8a8278",
            borderRadius: "20px",
            padding: "4px 12px",
            fontSize: "10.5px",
            cursor: "pointer",
            transition: "all 0.2s",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Tous
        </button>
        {legendTypes.map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setSelectedType(prev => prev === key ? null : key)}
            style={{
              background: selectedType === key ? `${cfg.color}22` : "rgba(232,220,200,0.04)",
              border: `1px solid ${selectedType === key ? cfg.color + "55" : "rgba(232,220,200,0.08)"}`,
              color: selectedType === key ? cfg.color : "#8a8278",
              borderRadius: "20px",
              padding: "4px 12px",
              fontSize: "10.5px",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: cfg.color,
              display: "inline-block",
              opacity: selectedType === key ? 1 : 0.5,
            }} />
            {cfg.label}
          </button>
        ))}
      </div>

      {/* Graph */}
      <svg
        ref={svgRef}
        width={dimensions.w}
        height={dimensions.h}
        style={{
          display: "block",
          margin: "0 auto",
        }}
      />

      {/* Info Panel */}
      {displayNode && (
        <div style={{
          position: "absolute",
          top: 130,
          right: 20,
          width: 280,
          background: "rgba(18,18,31,0.95)",
          border: "1px solid rgba(200,192,180,0.12)",
          borderRadius: "8px",
          padding: "16px",
          backdropFilter: "blur(12px)",
          zIndex: 20,
          animation: "fadeIn 0.25s ease",
        }}>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: TYPE_CONFIG[displayNode.type]?.color || "#888",
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: TYPE_CONFIG[displayNode.type]?.color || "#888",
              fontWeight: 600,
            }}>
              {TYPE_CONFIG[displayNode.type]?.label}
            </span>
          </div>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "17px",
            fontWeight: 700,
            color: "#e8dcc8",
            margin: "0 0 8px",
          }}>
            {displayNode.label}
          </h3>

          {displayNode.budget && (
            <div style={{
              display: "flex",
              gap: "12px",
              marginBottom: 10,
              paddingBottom: 10,
              borderBottom: "1px solid rgba(200,192,180,0.08)",
            }}>
              <div>
                <div style={{ fontSize: "9px", color: "#8a8278", textTransform: "uppercase", letterSpacing: "0.8px" }}>Budget</div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#D4A843" }}>{displayNode.budget}M€</div>
              </div>
              {displayNode.influence && (
                <div>
                  <div style={{ fontSize: "9px", color: "#8a8278", textTransform: "uppercase", letterSpacing: "0.8px" }}>Rang influence</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#e8dcc8" }}>#{displayNode.influence}</div>
                </div>
              )}
            </div>
          )}

          {displayNode.model && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: "9px", color: "#8a8278", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 2 }}>Modèle</div>
              <div style={{ fontSize: "12px", color: "#c8c0b4" }}>{displayNode.model}</div>
            </div>
          )}

          {displayNode.focus && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: "9px", color: "#8a8278", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 2 }}>Focus</div>
              <div style={{ fontSize: "12px", color: "#c8c0b4" }}>{displayNode.focus}</div>
            </div>
          )}

          {displayNode.political && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: "9px", color: "#8a8278", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 2 }}>Positionnement</div>
              <div style={{ fontSize: "12px", color: "#c8c0b4" }}>{displayNode.political}</div>
            </div>
          )}

          <p style={{
            fontSize: "11.5px",
            color: "#9a9288",
            lineHeight: "1.55",
            margin: "8px 0 0",
            fontStyle: "italic",
          }}>
            {displayNode.details}
          </p>

          {/* Connected nodes */}
          {displayNode.type === "think_tank" && (() => {
            const funders = DATA.links
              .filter(l => {
                const tId = typeof l.target === "string" ? l.target : l.target.id;
                return tId === displayNode.id;
              })
              .map(l => {
                const sId = typeof l.source === "string" ? l.source : l.source.id;
                return { node: DATA.nodes.find(n => n.id === sId), strength: l.strength };
              })
              .filter(f => f.node)
              .sort((a, b) => b.strength - a.strength);

            if (!funders.length) return null;
            return (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(200,192,180,0.08)" }}>
                <div style={{ fontSize: "9px", color: "#8a8278", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Principaux bailleurs</div>
                {funders.map(f => (
                  <div key={f.node.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: TYPE_CONFIG[f.node.type]?.color || "#888",
                      flexShrink: 0,
                    }} />
                    <span style={{ fontSize: "11px", color: "#c8c0b4" }}>{f.node.label}</span>
                    <span style={{
                      marginLeft: "auto",
                      fontSize: "9px",
                      color: "#8a8278",
                    }}>
                      {"●".repeat(f.strength)}
                    </span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* Instructions */}
      <div style={{
        position: "absolute",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "10px",
        color: "#5a5650",
        letterSpacing: "1px",
        textTransform: "uppercase",
        textAlign: "center",
        zIndex: 10,
      }}>
        Survoler un nœud pour explorer les connexions · Cliquer pour fixer · Glisser pour déplacer · Molette pour zoomer
      </div>

      {/* Key insights floating */}
      {!displayNode && (
        <div style={{
          position: "absolute",
          top: 130,
          right: 20,
          width: 240,
          zIndex: 10,
        }}>
          <div style={{
            background: "rgba(18,18,31,0.9)",
            border: "1px solid rgba(200,192,180,0.08)",
            borderRadius: "8px",
            padding: "14px",
          }}>
            <div style={{
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "1.2px",
              color: "#D4A843",
              fontWeight: 600,
              marginBottom: 8,
            }}>
              Chiffres clés
            </div>
            {[
              ["100M€+", "Investissement US total estimé"],
              ["1/3", "Part US dans le financement total"],
              ["~1M€/an", "Google, 1er bailleur privé"],
              ["6M€", "MCC Brussels, 100% financement hongrois"],
              ["17%", "Part CERV dans le budget Delors"],
              ["209→83M€", "Chute des investissements OSF (2022-24)"],
            ].map(([val, desc], i) => (
              <div key={i} style={{ marginBottom: 7, display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#e8dcc8", whiteSpace: "nowrap", minWidth: 65 }}>{val}</span>
                <span style={{ fontSize: "10.5px", color: "#8a8278", lineHeight: 1.3 }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
