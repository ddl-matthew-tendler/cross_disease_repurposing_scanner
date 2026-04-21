/* ── Debug Store (runs before React mounts) ──────────────── */
var _debugLogs = [];
var _debugApiCalls = [];
var _debugListeners = [];
var _debugEnabled = (function() {
  try { return window.location.search.indexOf('debug') !== -1 || localStorage.getItem('repurposing_debug') === '1'; } catch(e) { return false; }
})();

function _dbPush() { _debugListeners.forEach(function(fn) { try { fn(); } catch(e) {} }); }

(function() {
  var methods = ['log', 'warn', 'error', 'info'];
  methods.forEach(function(m) {
    var orig = console[m].bind(console);
    console[m] = function() {
      var args = Array.prototype.slice.call(arguments);
      var msg = args.map(function(a) {
        try { return (typeof a === 'object' && a !== null) ? JSON.stringify(a) : String(a); } catch(e) { return String(a); }
      }).join(' ');
      _debugLogs.unshift({ id: Date.now() + Math.random(), type: m, msg: msg, ts: new Date().toISOString() });
      if (_debugLogs.length > 600) _debugLogs.length = 600;
      _dbPush();
      orig.apply(console, arguments);
    };
  });
})();

(function() {
  var origFetch = window.fetch;
  window.fetch = function(url, opts) {
    var method = (opts && opts.method) || 'GET';
    var start = Date.now();
    var entry = { id: start + Math.random(), method: method, url: String(url), status: null, duration: null, ts: new Date().toISOString(), pending: true };
    _debugApiCalls.unshift(entry);
    if (_debugApiCalls.length > 200) _debugApiCalls.length = 200;
    _dbPush();
    return origFetch.apply(window, arguments).then(function(resp) {
      entry.status = resp.status; entry.duration = Date.now() - start; entry.pending = false;
      _dbPush();
      return resp;
    }).catch(function(err) {
      entry.status = 'ERR'; entry.duration = Date.now() - start; entry.pending = false; entry.error = err.message;
      _dbPush();
      throw err;
    });
  };
})();

window.addEventListener('error', function(e) {
  _debugLogs.unshift({ id: Date.now() + Math.random(), type: 'error', msg: 'Uncaught: ' + e.message + (e.filename ? ' @ ' + e.filename + ':' + e.lineno : ''), ts: new Date().toISOString() });
  _dbPush();
});

window.addEventListener('unhandledrejection', function(e) {
  var msg = e.reason ? (e.reason.message || String(e.reason)) : 'Unhandled rejection';
  _debugLogs.unshift({ id: Date.now() + Math.random(), type: 'error', msg: 'UnhandledPromise: ' + msg, ts: new Date().toISOString() });
  _dbPush();
});

/* ── Globals ─────────────────────────────────────────────── */
var _antd = antd;
var ConfigProvider = _antd.ConfigProvider, Button = _antd.Button, Input = _antd.Input,
    Table = _antd.Table, Tag = _antd.Tag, Tooltip = _antd.Tooltip, Modal = _antd.Modal,
    Slider = _antd.Slider, Progress = _antd.Progress, Spin = _antd.Spin, Switch = _antd.Switch,
    Select = _antd.Select, Form = _antd.Form, Radio = _antd.Radio, message = _antd.message,
    Empty = _antd.Empty, Divider = _antd.Divider, Space = _antd.Space, Alert = _antd.Alert,
    Popconfirm = _antd.Popconfirm;

var _r = React;
var h = _r.createElement, Fragment = _r.Fragment,
    useState = _r.useState, useEffect = _r.useEffect,
    useMemo = _r.useMemo, useRef = _r.useRef, useCallback = _r.useCallback;

var _icons = (typeof window !== 'undefined' && window.icons) ? window.icons : {};
var ExperimentOutlined = _icons.ExperimentOutlined, BarChartOutlined = _icons.BarChartOutlined,
    InboxOutlined = _icons.InboxOutlined, AuditOutlined = _icons.AuditOutlined,
    InfoCircleOutlined = _icons.InfoCircleOutlined, CheckCircleFilled = _icons.CheckCircleFilled,
    CloseCircleFilled = _icons.CloseCircleFilled, EyeOutlined = _icons.EyeOutlined,
    RiseOutlined = _icons.RiseOutlined, FallOutlined = _icons.FallOutlined,
    ArrowRightOutlined = _icons.ArrowRightOutlined, SearchOutlined = _icons.SearchOutlined;

/* ── Highcharts global theme ──────────────────────────────── */
if (typeof Highcharts !== 'undefined') {
  Highcharts.setOptions({
    colors: ['#543FDE', '#0070CC', '#28A464', '#CCB718', '#FF6543', '#E835A7', '#2EDCC4', '#A9734C'],
    chart: { style: { fontFamily: 'Inter, Lato, Helvetica Neue, Arial, sans-serif' } },
    title: { style: { color: '#2E2E38', fontWeight: '600' } },
    credits: { enabled: false },
  });
}

/* ── Domino Theme ─────────────────────────────────────────── */
var dominoTheme = {
  token: {
    colorPrimary: '#543FDE', colorPrimaryHover: '#3B23D1', colorPrimaryActive: '#311EAE',
    colorText: '#2E2E38', colorTextSecondary: '#65657B', colorTextTertiary: '#8F8FA3',
    colorSuccess: '#28A464', colorWarning: '#CCB718', colorError: '#C20A29', colorInfo: '#0070CC',
    colorBgContainer: '#FFFFFF', colorBgLayout: '#FAFAFA', colorBorder: '#E0E0E0',
    fontFamily: 'Inter, Lato, Helvetica Neue, Helvetica, Arial, sans-serif',
    fontSize: 14, borderRadius: 4, borderRadiusLG: 8,
  },
  components: {
    Button: { primaryShadow: 'none', defaultShadow: 'none' },
    Table: { headerBg: '#FAFAFA', rowHoverBg: '#F5F5F5' },
  },
};

/* ── Helpers ─────────────────────────────────────────────── */
function scoreColor(s) {
  if (s >= 7.5) return '#28A464';
  if (s >= 5.5) return '#CCB718';
  return '#C20A29';
}

function taCls(ta) {
  var map = { autoimmune: 'autoimmune', oncology: 'oncology', fibrotic: 'fibrotic',
              metabolic: 'metabolic', neurological: 'neurological', hematologic: 'hematologic',
              rare: 'rare' };
  return 'ta-badge ta-' + (map[ta] || 'other');
}

function taLabel(ta) {
  var map = { autoimmune: 'Immunology', oncology: 'Oncology', fibrotic: 'Fibrotic/Resp.',
              metabolic: 'Metabolic', neurological: 'Neurological', hematologic: 'Hematologic',
              rare: 'Rare Disease', other: 'Other' };
  return map[ta] || ta;
}

function phaseCls(phase) {
  if (!phase) return 'badge badge-lo';
  var p = phase.toLowerCase();
  if (p.indexOf('3') !== -1) return 'badge badge-phase3';
  if (p.indexOf('2') !== -1) return 'badge badge-phase2';
  if (p.indexOf('1') !== -1) return 'badge badge-phase1';
  if (p.indexOf('ind') !== -1) return 'badge badge-ind';
  if (p.indexOf('lead') !== -1 || p.indexOf('opt') !== -1) return 'badge badge-lo';
  return 'badge badge-lo';
}

function statusCls(s) {
  return 'badge badge-' + (s || 'other');
}

function statusLabel(s) {
  return { active: 'Active', preclinical: 'Preclinical', shelved: 'Shelved' }[s] || s;
}

function decisionCls(d) {
  return 'decision-badge decision-' + (d || 'watch');
}

function decisionIcon(d) {
  if (d === 'advance') return CheckCircleFilled;
  if (d === 'kill')    return CloseCircleFilled;
  if (d === 'watch')   return EyeOutlined;
  return null;
}

function decisionLabel(d) {
  return { advance: 'Advance', kill: 'Kill', watch: 'Watch' }[d] || d;
}

function formatDate(iso) {
  if (!iso) return '—';
  return dayjs(iso).format('MMM D, YYYY');
}

function competitorPhaseCls(phase) {
  var map = { Approved: 'badge badge-active', 'Phase 3': 'badge badge-phase3',
              'Phase 2': 'badge badge-phase2', 'Phase 1': 'badge badge-phase1', None: 'badge badge-lo' };
  return map[phase] || 'badge badge-lo';
}

function computeComposite(scores, weights) {
  var total = (weights.biologicalPlausibility + weights.unmetNeed +
               weights.competitiveWhitespace + weights.translationalFeasibility +
               weights.commercialAttractiveness) || 100;
  var val = (scores.biologicalPlausibility   * weights.biologicalPlausibility +
             scores.unmetNeed                * weights.unmetNeed +
             scores.competitiveWhitespace    * weights.competitiveWhitespace +
             scores.translationalFeasibility * weights.translationalFeasibility +
             scores.commercialAttractiveness * weights.commercialAttractiveness) / total;
  return Math.round(val * 10) / 10;
}

function computeRanked(indications, weights) {
  if (!indications || !indications.length) return [];
  return indications
    .map(function(ind) {
      return Object.assign({}, ind, { composite: computeComposite(ind.scores, weights) });
    })
    .sort(function(a, b) { return b.composite - a.composite; })
    .map(function(ind, i) { return Object.assign({}, ind, { rank: i + 1 }); });
}

function generateSimpleGraph(compound, indication) {
  if (!compound || !indication) return { nodes: [], edges: [] };
  var targets = (compound.targets || []).slice(0, 3);
  var nodes = [];
  var edges = [];
  targets.forEach(function(t, i) {
    nodes.push({ id: 't' + i, type: 'target', label: t, name: t + ' (target)' });
  });
  nodes.push({ id: 'pw1', type: 'pathway', label: 'Pathway', name: 'Convergent pathway' });
  nodes.push({ id: 'dis', type: 'disease', label: 'Disease', name: indication.name });
  nodes.push({ id: 'ev1', type: 'evidence', label: 'KG', name: 'Knowledge-graph evidence (Open Targets)' });
  targets.forEach(function(t, i) {
    edges.push({ source: 't' + i, target: 'pw1', label: 'modulates' });
  });
  edges.push({ source: 'pw1', target: 'dis', label: 'drives pathology' });
  edges.push({ source: 'ev1', target: 'dis', label: 'evidence link' });
  return { nodes: nodes, edges: edges };
}

/* ── API helpers ──────────────────────────────────────────── */
function apiGet(path) {
  return fetch(path).then(function(r) { return r.json(); });
}
function apiPost(path, body) {
  return fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(function(r) { return r.json(); });
}

/* ── StatCard ─────────────────────────────────────────────── */
function StatCard(props) {
  var cls = 'stat-card' + (props.onClick ? ' stat-card-clickable' : '') + (props.active ? ' stat-card-active' : '');
  return h('div', { className: cls, onClick: props.onClick || null },
    h('div', { className: 'stat-card-label' }, props.label),
    h('div', { className: 'stat-card-value ' + (props.color || '') }, props.value),
    props.sub ? h('div', { className: 'stat-card-sub' }, props.sub) : null
  );
}

/* ── ScoreBar ─────────────────────────────────────────────── */
function ScoreBar(props) {
  var val = props.value || 0;
  return h('div', { className: 'score-bar-wrap' },
    h('div', { className: 'score-bar-bg' },
      h('div', { className: 'score-bar-fill', style: { width: (val / 10 * 100) + '%', background: scoreColor(val) } })
    ),
    h('span', { className: 'score-bar-num', style: { color: scoreColor(val) } }, val.toFixed(1))
  );
}

/* ── ScoreMiniBar ─────────────────────────────────────────── */
var AXIS_COLORS = ['#543FDE', '#0070CC', '#28A464', '#CCB718', '#FF6543'];
var AXIS_KEYS = ['biologicalPlausibility', 'unmetNeed', 'competitiveWhitespace', 'translationalFeasibility', 'commercialAttractiveness'];
var AXIS_SHORT = ['BP', 'UN', 'CW', 'TF', 'CA'];
var AXIS_FULL  = ['Biological plausibility', 'Unmet need', 'Competitive whitespace', 'Translational feasibility', 'Commercial attractiveness'];

function ScoreMiniBar(props) {
  var scores = props.scores || {};
  return h('div', { className: 'score-mini-bars' },
    AXIS_KEYS.map(function(k, i) {
      var v = scores[k] || 0;
      var h_px = Math.max(2, Math.round(v / 10 * 24));
      return h(Tooltip, { key: k, title: AXIS_FULL[i] + ': ' + v.toFixed(1) },
        h('div', { className: 'score-mini-bar-item' },
          h('div', { className: 'score-mini-bar-fill', style: { height: h_px + 'px', background: AXIS_COLORS[i] } }),
          h('div', { className: 'score-mini-bar-lbl' }, AXIS_SHORT[i])
        )
      );
    })
  );
}

/* ── AxisRows ─────────────────────────────────────────────── */
function AxisRows(props) {
  var scores = props.scores || {};
  return h('div', { className: 'axes-grid' },
    AXIS_KEYS.map(function(k, i) {
      var v = scores[k] || 0;
      return h('div', { key: k, className: 'axis-row' },
        h('div', { className: 'axis-label', style: { color: AXIS_COLORS[i] } }, AXIS_FULL[i]),
        h('div', { className: 'score-bar-bg' },
          h('div', { className: 'score-bar-fill', style: { width: (v / 10 * 100) + '%', background: AXIS_COLORS[i] } })
        ),
        h('span', { style: { fontSize: 12, fontWeight: 700, color: AXIS_COLORS[i] } }, v.toFixed(1))
      );
    })
  );
}

/* ── RadarChart ───────────────────────────────────────────── */
function RadarChart(props) {
  var indication = props.indication;
  var containerRef = useRef(null);
  var chartRef = useRef(null);

  useEffect(function() {
    if (!containerRef.current) return;
    if (chartRef.current) {
      try { chartRef.current.destroy(); } catch(e) {}
      chartRef.current = null;
    }
    if (!indication) return;
    var scores = indication.scores;
    chartRef.current = Highcharts.chart(containerRef.current, {
      chart: { polar: true, type: 'line', height: 190, margin: [15, 20, 20, 20],
               style: { fontFamily: 'Inter, Arial, sans-serif' } },
      title: { text: null },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        categories: ['Bio. plausibility', 'Unmet need', 'Whitespace', 'Feasibility', 'Commercial'],
        tickmarkPlacement: 'on', lineWidth: 0,
        labels: { style: { fontSize: '9px', color: '#65657B' } },
      },
      yAxis: { gridLineInterpolation: 'polygon', lineWidth: 0, min: 0, max: 10,
               tickInterval: 5, labels: { style: { fontSize: '9px' } } },
      series: [{
        name: 'Score', type: 'area',
        data: [scores.biologicalPlausibility, scores.unmetNeed, scores.competitiveWhitespace,
               scores.translationalFeasibility, scores.commercialAttractiveness],
        pointPlacementOnXAxis: 'on',
        color: '#543FDE', fillColor: 'rgba(84,63,222,0.12)',
        lineWidth: 2, marker: { radius: 4 },
      }],
      tooltip: { pointFormat: '<b>{point.y:.1f}</b> / 10' },
    });
    return function() {
      if (chartRef.current) {
        try { chartRef.current.destroy(); } catch(e) {}
        chartRef.current = null;
      }
    };
  }, [indication ? indication.id : null]);

  return h('div', { ref: containerRef, className: 'radar-container' });
}

/* ── EvidenceGraph (D3) ───────────────────────────────────── */
function EvidenceGraph(props) {
  var graphData = props.graphData;
  var containerRef = useRef(null);

  var nodeColors = { target: '#543FDE', pathway: '#0070CC', disease: '#FF6543', evidence: '#28A464' };

  useEffect(function() {
    var el = containerRef.current;
    if (!el || !graphData || !graphData.nodes || !graphData.nodes.length) return;
    el.innerHTML = '';

    var W = el.offsetWidth || 358;
    var H = el.offsetHeight || 220;

    var nodes = graphData.nodes.map(function(n) { return Object.assign({}, n); });
    var edges = graphData.edges.map(function(e) { return Object.assign({}, e); });

    var svg = d3.select(el).append('svg')
      .attr('width', W).attr('height', H);

    var defs = svg.append('defs');
    defs.append('marker').attr('id', 'arrowhead').attr('viewBox', '0 -5 10 10')
      .attr('refX', 20).attr('refY', 0).attr('markerWidth', 6).attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path').attr('d', 'M0,-5L10,0L0,5').attr('fill', '#C0C0D0');

    var sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id(function(d) { return d.id; }).distance(75))
      .force('charge', d3.forceManyBody().strength(-220))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide().radius(26));

    var link = svg.append('g').selectAll('line').data(edges).enter().append('line')
      .attr('stroke', '#D1D1DB').attr('stroke-width', 1.2)
      .attr('marker-end', 'url(#arrowhead)');

    var nodeG = svg.append('g').selectAll('g').data(nodes).enter().append('g')
      .call(d3.drag()
        .on('start', function(event, d) { if (!event.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag',  function(event, d) { d.fx = event.x; d.fy = event.y; })
        .on('end',   function(event, d) { if (!event.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));

    nodeG.append('circle')
      .attr('r', 18)
      .attr('fill', function(d) { return (nodeColors[d.type] || '#888') + '20'; })
      .attr('stroke', function(d) { return nodeColors[d.type] || '#888'; })
      .attr('stroke-width', 2);

    nodeG.append('text')
      .text(function(d) { return d.label; })
      .attr('text-anchor', 'middle').attr('dy', '0.35em')
      .attr('font-size', 9).attr('font-weight', 700)
      .attr('fill', function(d) { return nodeColors[d.type] || '#888'; });

    var labels = svg.append('g').selectAll('text').data(nodes).enter().append('text')
      .text(function(d) { return d.name.length > 22 ? d.name.slice(0, 20) + '…' : d.name; })
      .attr('text-anchor', 'middle').attr('font-size', 8).attr('fill', '#65657B');

    sim.on('tick', function() {
      link
        .attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });
      nodeG.attr('transform', function(d) {
        d.x = Math.max(24, Math.min(W - 24, d.x));
        d.y = Math.max(24, Math.min(H - 24, d.y));
        return 'translate(' + d.x + ',' + d.y + ')';
      });
      labels
        .attr('x', function(d) { return d.x; })
        .attr('y', function(d) { return d.y + 30; });
    });

    return function() { sim.stop(); el.innerHTML = ''; };
  }, [graphData]);

  return h('div', { ref: containerRef, className: 'evidence-graph-container' });
}

/* ── CompoundList ─────────────────────────────────────────── */
function CompoundList(props) {
  var portfolio = props.portfolio, selected = props.selected,
      onSelect = props.onSelect, search = props.search, onSearch = props.onSearch;

  var filtered = useMemo(function() {
    if (!search) return portfolio;
    var q = search.toLowerCase();
    return portfolio.filter(function(c) {
      return c.name.toLowerCase().indexOf(q) !== -1 ||
             c.code.toLowerCase().indexOf(q) !== -1 ||
             c.mechanism.toLowerCase().indexOf(q) !== -1 ||
             (c.primaryIndication && c.primaryIndication.toLowerCase().indexOf(q) !== -1);
    });
  }, [portfolio, search]);

  var groups = [
    { key: 'active',      label: 'Active clinical' },
    { key: 'preclinical', label: 'Preclinical' },
    { key: 'shelved',     label: 'Shelved / de-prioritized' },
  ];

  return h('div', { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
    h('div', { className: 'compound-search' },
      h(Input, { placeholder: 'Search compounds…', value: search,
                 onChange: function(e) { onSearch(e.target.value); },
                 size: 'small', allowClear: true })
    ),
    h('div', { className: 'pane-body' },
      groups.map(function(g) {
        var items = filtered.filter(function(c) { return c.status === g.key; });
        if (!items.length) return null;
        return h('div', { key: g.key },
          h('div', { className: 'compound-group-label' }, g.label + ' (' + items.length + ')'),
          items.map(function(c) {
            var isSel = selected && selected.id === c.id;
            return h('div', { key: c.id, className: 'compound-item' + (isSel ? ' selected' : ''),
                              onClick: function() { onSelect(c); } },
              h('div', { className: 'compound-item-name' }, c.name),
              h('div', { className: 'compound-item-code' }, c.code),
              h('div', { className: 'compound-item-mech' }, c.mechanism),
              h('div', { className: 'compound-item-badges' },
                h('span', { className: phaseCls(c.phase) }, c.phase),
                h('span', { className: statusCls(c.status) }, statusLabel(c.status))
              )
            );
          })
        );
      }),
      !filtered.length && h('div', { className: 'empty-center empty-center-inline' },
        h('div', { className: 'empty-center-text' }, 'No compounds match your search'),
        h('div', { className: 'empty-center-sub' }, 'Try different keywords or clear the search above'),
        h(Button, { size: 'small', type: 'link', onClick: function() { onSearch(''); } }, 'Clear search')
      )
    )
  );
}

/* ── WeightSliders ────────────────────────────────────────── */
function WeightSliders(props) {
  var weights = props.weights, onChange = props.onChange;
  var LABELS = ['Bio. plausibility', 'Unmet need', 'Comp. whitespace', 'Translational', 'Commercial'];
  return h('div', { className: 'weights-panel', 'data-tour': 'weights' },
    h('div', { className: 'weights-title' }, 'Scoring weights'),
    h('div', { className: 'weights-grid' },
      AXIS_KEYS.map(function(k, i) {
        return h('div', { key: k, className: 'weight-item' },
          h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            h('div', { className: 'weight-label', style: { color: AXIS_COLORS[i] } }, LABELS[i]),
            h('div', { className: 'weight-value' }, weights[k])
          ),
          h(Slider, { min: 0, max: 100, step: 5, value: weights[k], size: 'small',
                      tooltip: { open: false },
                      onChange: function(v) {
                        var next = Object.assign({}, weights);
                        next[k] = v;
                        onChange(next);
                      } })
        );
      })
    )
  );
}

/* ── IndicationTable ──────────────────────────────────────── */
function IndicationTable(props) {
  var indications = props.indications, selected = props.selected, onSelect = props.onSelect;

  var uniqueTas = useMemo(function() {
    var s = {};
    (indications || []).forEach(function(r) { if (r.ta) s[r.ta] = true; });
    return Object.keys(s).sort();
  }, [indications]);

  var columns = [
    { title: '#', dataIndex: 'rank', key: 'rank', width: 38,
      sorter: function(a, b) { return a.rank - b.rank; },
      render: function(v) { return h('div', { className: 'rank-num' }, v); } },
    { title: 'Indication', dataIndex: 'name', key: 'name', width: 180, ellipsis: true,
      sorter: function(a, b) { return a.name.localeCompare(b.name); },
      filters: uniqueTas.map(function(ta) { return { text: taLabel(ta), value: ta }; }),
      onFilter: function(v, r) { return r.ta === v; },
      render: function(name, rec) {
        return h('div', { className: 'indication-name-cell' },
          h(Tooltip, { title: name, mouseEnterDelay: 0.3 },
            h('div', { className: 'ind-name' }, name)
          ),
          h('div', { style: { marginTop: 2 } }, h('span', { className: taCls(rec.ta) }, taLabel(rec.ta)))
        );
      } },
    { title: 'Score', dataIndex: 'composite', key: 'composite', width: 95,
      sorter: function(a, b) { return a.composite - b.composite; },
      defaultSortOrder: 'descend',
      render: function(v) { return h(ScoreBar, { value: v }); } },
    { title: 'Axes', key: 'axes', width: 90,
      render: function(_, rec) { return h(ScoreMiniBar, { scores: rec.scores }); } },
    { title: 'Competitors', key: 'comp', width: 82,
      sorter: function(a, b) { return a.competitorCount - b.competitorCount; },
      render: function(_, rec) {
        return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 2 } },
          h('span', { style: { fontSize: 12, fontWeight: 600 } }, rec.competitorCount + ' active'),
          h('span', { className: competitorPhaseCls(rec.competitorPhase) }, rec.competitorPhase)
        );
      } },
    { title: 'IP (yr)', dataIndex: 'patentRunwayYears', key: 'ip', width: 62,
      sorter: function(a, b) { return a.patentRunwayYears - b.patentRunwayYears; },
      render: function(v) {
        var col = v >= 10 ? '#28A464' : v >= 6 ? '#CCB718' : '#C20A29';
        return h('span', { style: { fontWeight: 700, fontSize: 13, color: col } }, v);
      } },
    { title: '', key: 'action', width: 72, fixed: 'right',
      render: function(_, rec) {
        return h(Button, { size: 'small', type: 'link',
                           onClick: function(e) { e.stopPropagation(); onSelect(rec); } }, 'Open');
      } },
  ];

  return h('div', { className: 'indication-table-wrap', 'data-tour': 'indications' },
    h(Table, {
      dataSource: indications || [],
      columns: columns,
      rowKey: 'id',
      size: 'small',
      pagination: { pageSize: 20, size: 'small', showSizeChanger: false, showTotal: function(t) { return t + ' indications'; } },
      rowClassName: function(rec) { return selected && selected.id === rec.id ? 'ant-table-row-selected' : ''; },
      onRow: function(rec) { return { onClick: function() { onSelect(rec); } }; },
      scroll: { x: 600 },
    })
  );
}

/* ── DecisionModal ────────────────────────────────────────── */
function DecisionModal(props) {
  var visible = props.visible, compound = props.compound, indication = props.indication,
      scores = props.scores, onClose = props.onClose, onSubmit = props.onSubmit;
  var _s = useState('advance'); var decVal = _s[0]; var setDecVal = _s[1];
  var _r2 = useState(''); var rationale = _r2[0]; var setRationale = _r2[1];
  var _db = useState(''); var decidedBy = _db[0]; var setDecidedBy = _db[1];

  function handleSubmit() {
    if (!rationale.trim() || !decidedBy.trim()) {
      message.warning('Please enter a rationale and your name.');
      return;
    }
    onSubmit({ decision: decVal, rationale: rationale, decidedBy: decidedBy,
               compoundId: compound && compound.id, indicationId: indication && indication.id,
               evidenceSnapshot: scores });
    setDecVal('advance'); setRationale(''); setDecidedBy('');
  }

  return h(Modal, {
    title: 'Record committee decision',
    open: visible,
    onCancel: onClose,
    width: 480,
    footer: h('div', { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' } },
      h(Button, { onClick: onClose }, 'Cancel'),
      h(Button, { type: 'primary', onClick: handleSubmit }, 'Record Decision')
    ),
  },
    compound && indication && h('div', { style: { marginBottom: 14, padding: '8px 12px', background: '#FAFAFA', borderRadius: 6, border: '1px solid #EFEFEF' } },
      h('div', { style: { fontSize: 11, color: '#8F8FA3', fontWeight: 600 } }, compound.name + ' (' + compound.code + ')'),
      h('div', { style: { fontSize: 14, fontWeight: 600, marginTop: 2 } }, indication.name)
    ),
    h('div', { style: { marginBottom: 12 } },
      h('div', { style: { fontSize: 12, fontWeight: 600, color: '#2E2E38', marginBottom: 6 } }, 'Decision'),
      h(Radio.Group, { value: decVal, onChange: function(e) { setDecVal(e.target.value); } },
        h(Radio, { value: 'advance', className: 'decision-radio decision-radio-advance' }, 'Advance to next step'),
        h(Radio, { value: 'watch',   className: 'decision-radio decision-radio-watch' }, 'Watch / monitor'),
        h(Radio, { value: 'kill',    className: 'decision-radio decision-radio-kill' }, 'Kill / de-prioritize')
      )
    ),
    h('div', { style: { marginBottom: 12 } },
      h('div', { style: { fontSize: 12, fontWeight: 600, color: '#2E2E38', marginBottom: 4 } }, 'Rationale'),
      h(Input.TextArea, { rows: 3, value: rationale, onChange: function(e) { setRationale(e.target.value); },
                          placeholder: 'Summarise the committee\'s reasoning for this decision…' })
    ),
    h('div', {},
      h('div', { style: { fontSize: 12, fontWeight: 600, color: '#2E2E38', marginBottom: 4 } }, 'Decided by'),
      h(Input, { value: decidedBy, onChange: function(e) { setDecidedBy(e.target.value); },
                 placeholder: 'Name and role (e.g. Dr. Jane Smith, Head of TM)' })
    )
  );
}

/* ── DossierPane ──────────────────────────────────────────── */
function DossierPane(props) {
  var compound = props.compound, indication = props.indication,
      dossier = props.dossier, onDecision = props.onDecision;

  if (!compound || !indication) {
    return h('div', { className: 'dossier-empty' },
      h('div', { className: 'dossier-empty-icon' }),
      h('div', { className: 'dossier-empty-text' }, 'Select an indication to view dossier'),
      h('div', { className: 'dossier-empty-sub' }, 'Click any row in the centre pane')
    );
  }

  var graphData = dossier && dossier.evidenceGraph
    ? dossier.evidenceGraph
    : generateSimpleGraph(compound, indication);

  var competitive = indication.competitive || [];

  return h('div', { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
    /* scrollable body */
    h('div', { className: 'pane-body' },
      h('div', { className: 'dossier-content' },
        /* header */
        h('div', { className: 'dossier-header' },
          h('div', { className: 'dossier-compound-name' }, compound.code + ' · ' + compound.name),
          h('div', { className: 'dossier-indication-name' }, indication.name),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 } },
            h('span', { className: taCls(indication.ta) }, taLabel(indication.ta)),
            dossier && h('span', { className: 'dossier-draft-badge' }, dossier.draftStatus)
          )
        ),
        /* radar chart (axis numerics exposed in the radar tooltip) */
        h('div', { className: 'dossier-section' },
          h('div', { className: 'dossier-section-title' }, 'Score profile'),
          h(RadarChart, { indication: indication })
        ),
        /* callout row */
        h('div', { className: 'callout-row' },
          h('div', { className: 'callout-card callout-' + (indication.patentRunwayYears >= 10 ? 'green' : indication.patentRunwayYears >= 6 ? 'amber' : 'red') },
            h('div', { className: 'callout-card-label' }, 'IP Runway'),
            h('div', { className: 'callout-card-value' }, indication.patentRunwayYears + ' yr'),
            h('div', { className: 'callout-card-sub' }, 'to CoM patent expiry')
          ),
          h('div', { className: 'callout-card callout-' + (indication.competitorCount === 0 ? 'green' : indication.competitorCount <= 2 ? 'amber' : 'red') },
            h('div', { className: 'callout-card-label' }, 'Competitors'),
            h('div', { className: 'callout-card-value' }, indication.competitorCount),
            h('div', { className: 'callout-card-sub' }, 'Leading: ' + indication.competitorPhase)
          )
        ),
        /* mechanistic rationale */
        h('div', { className: 'dossier-section' },
          h('div', { className: 'dossier-section-title' }, 'Mechanistic rationale'),
          h('div', { className: 'dossier-text' },
            dossier ? dossier.mechanisticRationale : indication.evidenceSummary
          )
        ),
        /* key mechanism */
        h('div', { className: 'dossier-section' },
          h('div', { className: 'dossier-section-title' }, 'Key mechanism'),
          h('div', { style: { fontSize: 12, color: '#543FDE', fontWeight: 600, padding: '6px 10px', background: '#F5F1FF', borderRadius: 5 } },
            indication.keyMechanism
          )
        ),
        /* evidence graph */
        h('div', { className: 'dossier-section' },
          h('div', { className: 'dossier-section-title' }, 'Evidence graph'),
          h(EvidenceGraph, { graphData: graphData }),
          h('div', { className: 'evidence-graph-legend' },
            [['target','#543FDE','Target'],['pathway','#0070CC','Pathway'],['disease','#FF6543','Disease'],['evidence','#28A464','Evidence']].map(function(item) {
              return h('div', { key: item[0], className: 'legend-item' },
                h('div', { className: 'legend-dot', style: { background: item[1] } }),
                h('span', null, item[2])
              );
            })
          )
        ),
        /* unmet need */
        dossier && h('div', { className: 'dossier-section' },
          h('div', { className: 'dossier-section-title' }, 'Unmet need assessment'),
          h('div', { className: 'dossier-text' }, dossier.unmetNeedNarrative)
        ),
        /* competitive landscape */
        competitive.length > 0 && h('div', { className: 'dossier-section' },
          h('div', { className: 'dossier-section-title' }, 'Competitive landscape'),
          competitive.map(function(c, i) {
            return h('div', { key: i, className: 'competitive-item' },
              h('div', { className: 'competitive-item-phase ' + competitorPhaseCls(c.phase) }, c.phase),
              h('div', { className: 'competitive-item-info' },
                h('div', { className: 'competitive-item-drug' }, c.drug),
                h('div', { className: 'competitive-item-sponsor' }, c.sponsor)
              )
            );
          })
        ),
        /* IP considerations */
        dossier && h('div', { className: 'dossier-section' },
          h('div', { className: 'dossier-section-title' }, 'IP considerations'),
          h('div', { className: 'dossier-text' }, dossier.ipConsiderations)
        ),
        /* proposed experiment */
        h('div', { className: 'dossier-section' },
          h('div', { className: 'dossier-section-title' }, 'Proposed next experiment'),
          h('div', { className: 'experiment-box' },
            dossier ? dossier.proposedNextExperiment : indication.proposedExperiment
          )
        ),
        /* citations */
        h('div', { className: 'dossier-section' },
          h('div', { className: 'dossier-section-title' }, 'Key citations'),
          (indication.citations || []).map(function(c, i) {
            return h('div', { key: i, className: 'citation-item' },
              h('a', { href: 'https://pubmed.ncbi.nlm.nih.gov/' + c.pmid, target: '_blank', rel: 'noreferrer' },
                c.title),
              ' — ' + c.journal + ' ' + c.year
            );
          })
        )
      )
    ),
    /* action footer */
    h('div', { className: 'dossier-actions' },
      h(Button, { type: 'primary',
                  onClick: function() { onDecision(); } }, 'Record decision'),
      h(Button, { onClick: function() { window.print(); } }, 'Export PDF')
    )
  );
}

/* ── ScannerPage ──────────────────────────────────────────── */
function ScannerPage(props) {
  var portfolio      = props.portfolio;
  var allIndications = props.allIndications;
  var allDossiers    = props.allDossiers;
  var weights        = props.weights;
  var onWeightsChange= props.onWeightsChange;
  var onDecisionRecord = props.onDecisionRecord;
  var useDummy       = props.useDummy;

  var _sc = useState('');     var search   = _sc[0]; var setSearch   = _sc[1];
  var _cmp = useState(null);  var selCmp   = _cmp[0]; var setSelCmp  = _cmp[1];
  var _ind = useState(null);  var selInd   = _ind[0]; var setSelInd  = _ind[1];
  var _dm = useState(false);  var dmVis    = _dm[0];  var setDmVis   = _dm[1];

  useEffect(function() {
    if (!props.preselect) return;
    var cmp = (portfolio || []).find(function(c) { return c.id === props.preselect.compoundId; });
    if (cmp) setSelCmp(cmp);
    var inds = (allIndications && cmp) ? allIndications[cmp.id] || [] : [];
    var ind = inds.find(function(i) { return i.id === props.preselect.indicationId; });
    if (ind) {
      var rankedInds = computeRanked(inds, props.weights);
      var fresh = rankedInds.find(function(r) { return r.id === ind.id; }) || ind;
      setSelInd(fresh);
    }
  }, [props.preselect && props.preselect.token]);

  var rawIndications = useMemo(function() {
    if (!selCmp) return [];
    return allIndications[selCmp.id] || [];
  }, [selCmp, allIndications]);

  var ranked = useMemo(function() {
    return computeRanked(rawIndications, weights);
  }, [rawIndications, weights]);

  var selectedDossier = useMemo(function() {
    if (!selInd) return null;
    return allDossiers[selInd.id] || null;
  }, [selInd, allDossiers]);

  function handleCompoundSelect(c) { setSelCmp(c); setSelInd(null); }
  function handleIndicationSelect(ind) {
    var fresh = ranked.find(function(r) { return r.id === ind.id; }) || ind;
    setSelInd(fresh);
  }

  return h('div', { className: 'scanner-layout' },
    /* Left pane */
    h('div', { className: 'scanner-pane', 'data-tour': 'portfolio' },
      h('div', { className: 'pane-header' },
        h('div', { className: 'pane-title' }, 'Portfolio (' + portfolio.length + ' assets)')
      ),
      h(CompoundList, { portfolio: portfolio, selected: selCmp, onSelect: handleCompoundSelect,
                        search: search, onSearch: setSearch })
    ),
    /* Centre pane */
    h('div', { className: 'scanner-pane', 'data-tour': 'center', style: { display: 'flex', flexDirection: 'column' } },
      selCmp
        ? h('div', { className: 'pane-header' },
            h('div', { className: 'pane-title' }, selCmp.name + ' · ' + selCmp.mechanism),
            h('div', { style: { fontSize: 11, color: '#8F8FA3', marginTop: 2 } }, ranked.length + ' candidate indications')
          )
        : h('div', { className: 'pane-header' }, h('div', { className: 'pane-title' }, 'Select a compound to scan')),
      selCmp && h(WeightSliders, { weights: weights, onChange: onWeightsChange }),
      selCmp
        ? h(IndicationTable, { indications: ranked, selected: selInd, onSelect: handleIndicationSelect })
        : h('div', { className: 'empty-center' },
            h('div', { className: 'empty-center-icon' }, '⊙'),
            h('div', { className: 'empty-center-text' }, 'Select a compound from the left panel'),
            h('div', { className: 'empty-center-sub' }, portfolio.length + ' assets in portfolio')
          )
    ),
    /* Right pane */
    h('div', { className: 'scanner-pane', 'data-tour': 'dossier' },
      h('div', { className: 'pane-header' },
        h('div', { className: 'pane-title' }, selInd ? 'Dossier preview' : 'Dossier'),
        selInd && h('div', { style: { fontSize: 11, color: '#8F8FA3', marginTop: 2 } }, 'Rank #' + selInd.rank + ' · Score ' + (selInd.composite || 0).toFixed(1))
      ),
      h(DossierPane, {
        compound: selCmp, indication: selInd, dossier: selectedDossier,
        onDecision: function() { setDmVis(true); }
      }),
      h(DecisionModal, {
        visible: dmVis, compound: selCmp, indication: selInd,
        scores: selInd ? selInd.scores : null,
        onClose: function() { setDmVis(false); },
        onSubmit: function(data) {
          onDecisionRecord(data);
          setDmVis(false);
          message.success('Committee decision recorded.');
        }
      })
    )
  );
}

/* ── DashboardPage ────────────────────────────────────────── */
function DashboardPage(props) {
  var portfolio = props.portfolio, allIndications = props.allIndications, weights = props.weights;
  var onNavigate = props.onNavigate;
  var chartRef = useRef(null);
  var chartInst = useRef(null);

  var topCandidates = useMemo(function() {
    var all = [];
    portfolio.forEach(function(cmp) {
      var inds = allIndications[cmp.id] || [];
      var ranked = computeRanked(inds, weights);
      ranked.slice(0, 3).forEach(function(ind) {
        all.push({ compound: cmp, indication: ind, composite: ind.composite });
      });
    });
    return all.sort(function(a, b) { return b.composite - a.composite; }).slice(0, 10);
  }, [portfolio, allIndications, weights]);

  var stats = useMemo(function() {
    var active = portfolio.filter(function(c) { return c.status === 'active'; }).length;
    var shelved = portfolio.filter(function(c) { return c.status === 'shelved'; }).length;
    var totalInds = Object.values(allIndications).reduce(function(s, a) { return s + (a ? a.length : 0); }, 0);
    var avgScore = topCandidates.length ? Math.round(topCandidates.reduce(function(s, c) { return s + c.composite; }, 0) / topCandidates.length * 10) / 10 : 0;
    return { active: active, shelved: shelved, totalInds: totalInds, avgScore: avgScore };
  }, [portfolio, allIndications, topCandidates]);

  useEffect(function() {
    if (!chartRef.current || !topCandidates.length) return;
    if (chartInst.current) {
      try { chartInst.current.destroy(); } catch(e) {}
      chartInst.current = null;
    }
    var cats = topCandidates.map(function(c) { return c.compound.code + ' → ' + c.indication.name.slice(0, 28); });
    var data = topCandidates.map(function(c) { return { y: c.composite, name: c.indication.ta }; });
    var taColorMap = { autoimmune: '#6A1B9A', oncology: '#B71C1C', fibrotic: '#E65100',
                       metabolic: '#1B5E20', neurological: '#0D47A1', hematologic: '#880E4F',
                       rare: '#33691E', other: '#616161' };
    data.forEach(function(d) { d.color = taColorMap[d.name] || '#543FDE'; });

    chartInst.current = Highcharts.chart(chartRef.current, {
      chart: { type: 'bar', height: 280, margin: [10, 30, 40, 260],
               style: { fontFamily: 'Inter, Arial, sans-serif' } },
      title: { text: null },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: { categories: cats, labels: { style: { fontSize: '10px', color: '#2E2E38' } } },
      yAxis: { min: 0, max: 10, title: { text: null }, labels: { style: { fontSize: '10px' } } },
      series: [{ name: 'Composite Score', data: data,
                 dataLabels: { enabled: true, format: '{point.y:.1f}', style: { fontSize: '10px', fontWeight: '600' } } }],
      tooltip: { formatter: function() { return '<b>' + this.x + '</b><br/>Score: ' + this.y.toFixed(1); } },
      plotOptions: {
        bar: { borderRadius: 2, cursor: 'pointer',
               point: { events: { click: function() {
                 var cand = topCandidates[this.index];
                 if (cand && onNavigate) onNavigate(cand.compound.id, cand.indication.id);
               } } } }
      },
    });
    return function() {
      if (chartInst.current) { try { chartInst.current.destroy(); } catch(e) {} chartInst.current = null; }
    };
  }, [topCandidates]);

  var taCounts = useMemo(function() {
    var m = {};
    topCandidates.forEach(function(c) { var ta = c.indication.ta || 'other'; m[ta] = (m[ta] || 0) + 1; });
    return m;
  }, [topCandidates]);
  var topTA = useMemo(function() {
    return Object.entries(taCounts).sort(function(a, b) { return b[1] - a[1]; })[0];
  }, [taCounts]);

  var columns = [
    { title: '#', key: 'rank', width: 36, render: function(_, __, i) { return h('div', { className: 'rank-num' }, i + 1); } },
    { title: 'Compound', key: 'cmp', width: 120, render: function(_, rec) {
        return h('div', null,
          h('div', { style: { fontWeight: 600, fontSize: 12 } }, rec.compound.name),
          h('span', { className: phaseCls(rec.compound.phase), style: { marginTop: 2 } }, rec.compound.phase)
        );
      } },
    { title: 'Indication', key: 'ind', render: function(_, rec) {
        return h('div', null,
          h('div', { style: { fontWeight: 600, fontSize: 13 } }, rec.indication.name),
          h('span', { className: taCls(rec.indication.ta), style: { marginTop: 2 } }, taLabel(rec.indication.ta))
        );
      } },
    { title: 'Score', key: 'score', width: 90,
      render: function(_, rec) { return h(ScoreBar, { value: rec.composite }); } },
    { title: 'Axes', key: 'axes', width: 90,
      render: function(_, rec) { return h(ScoreMiniBar, { scores: rec.indication.scores }); } },
    { title: 'Whitespace', key: 'ws', width: 75,
      render: function(_, rec) {
        var v = rec.indication.scores.competitiveWhitespace;
        return h('span', { style: { fontWeight: 700, color: scoreColor(v) } }, v.toFixed(1));
      } },
  ];

  return h('div', { className: 'page-content' },
    h('div', { style: { fontWeight: 700, fontSize: 18, color: '#2E2E38', marginBottom: 4 } }, 'Portfolio committee dashboard'),
    h('div', { style: { fontSize: 12, color: '#8F8FA3', marginBottom: 16 } }, 'Top-10 repurposing candidates across all portfolio assets, ranked by weighted composite score'),
    h('div', { className: 'stats-row' },
      h(StatCard, { label: 'Active Assets', value: stats.active, color: 'success', sub: 'in clinical development' }),
      h(StatCard, { label: 'Indications Scanned', value: stats.totalInds, color: 'primary', sub: 'across ' + portfolio.length + ' compounds' }),
      h(StatCard, { label: 'Top TA', value: topTA ? taLabel(topTA[0]) : '—', color: 'info', sub: topTA ? topTA[1] + ' of top-10 candidates' : '' }),
      h(StatCard, { label: 'Avg Top Score', value: stats.avgScore, color: 'warning', sub: 'mean composite (top-10)' })
    ),
    h('div', { className: 'section-card', style: { marginBottom: 16 } },
      h('div', { className: 'section-card-header' },
        h('div', { className: 'section-card-title' }, 'Top 10 repurposing candidates — composite score')
      ),
      h('div', { style: { padding: '12px 16px' } },
        h('div', { ref: chartRef })
      )
    ),
    h('div', { className: 'section-card' },
      h('div', { className: 'section-card-header' },
        h('div', { className: 'section-card-title' }, 'Top 10 candidates')
      ),
      h(Table, { dataSource: topCandidates, columns: columns, rowKey: function(r) { return r.compound.id + '-' + r.indication.id; },
                 size: 'small', pagination: false, style: { margin: '0 8px 8px' },
                 rowClassName: function() { return 'dashboard-top-row'; },
                 onRow: function(rec) { return { onClick: function() { if (onNavigate) onNavigate(rec.compound.id, rec.indication.id); } }; } })
    )
  );
}

/* ── DustyShelfPage ───────────────────────────────────────── */
function DustyShelfPage(props) {
  var portfolio = props.portfolio, dustyShelf = props.dustyShelf;

  var shelved = portfolio.filter(function(c) { return c.status === 'shelved'; });
  var withSignals = shelved.filter(function(c) { return dustyShelf[c.id] && dustyShelf[c.id].externalChanges && dustyShelf[c.id].externalChanges.length > 0; });

  var columns = [
    { title: 'Compound', key: 'name', width: 130, render: function(_, rec) {
        return h('div', null,
          h('div', { style: { fontWeight: 700 } }, rec.name),
          h('div', { style: { fontSize: 11, color: '#8F8FA3' } }, rec.code + ' · ' + rec.mechanism)
        );
      } },
    { title: 'Shelved', dataIndex: 'shelvedDate', key: 'date', width: 90,
      render: function(v) { return h('span', { style: { fontSize: 12 } }, formatDate(v)); } },
    { title: 'Reason', dataIndex: 'shelvedReason', key: 'reason', ellipsis: true,
      render: function(v) { return h('span', { style: { fontSize: 12, color: '#65657B' } }, v); } },
    { title: 'Rescue Score', key: 'rs', width: 130, render: function(_, rec) {
        var d = dustyShelf[rec.id];
        if (!d) return h('span', { style: { color: '#8F8FA3', fontSize: 12 } }, 'No data');
        return h('div', null,
          h('div', { className: 'rescue-score-wrap' },
            h('div', { className: 'rescue-score-bar-bg' },
              h('div', { className: 'rescue-score-bar-fill', style: { width: (d.rescueScore / 10 * 100) + '%' } })
            ),
            h('span', { style: { fontSize: 12, fontWeight: 700, color: scoreColor(d.rescueScore), minWidth: 28 } }, d.rescueScore.toFixed(1))
          )
        );
      } },
    { title: 'Signals', key: 'signals', width: 70, render: function(_, rec) {
        var d = dustyShelf[rec.id];
        var n = d && d.externalChanges ? d.externalChanges.length : 0;
        if (!n) return h('span', { style: { color: '#8F8FA3', fontSize: 12 } }, '—');
        return h(Tag, { color: 'green' }, n + ' new');
      } },
    { title: '', key: 'action', width: 100, render: function(_, rec) {
        return h(Button, { size: 'small',
                           onClick: function() { message.success(rec.name + ' queued for next quarterly rescan.'); } },
          'Queue rescan');
      } },
  ];

  var expandRender = function(rec) {
    var d = dustyShelf[rec.id];
    if (!d) return h('div', { style: { padding: '8px 16px', color: '#8F8FA3' } }, 'No external signal data available for this asset.');
    return h('div', { style: { padding: '8px 24px 16px' } },
      h('div', { style: { fontWeight: 600, marginBottom: 8, fontSize: 13 } }, 'Rescue Hypothesis: ', h('span', { style: { fontWeight: 400, color: '#65657B' } }, d.rescueRationale)),
      h('div', { style: { fontWeight: 600, fontSize: 12, color: '#2E2E38', marginBottom: 8 } }, 'External signals since shelving'),
      (d.externalChanges || []).map(function(sig, i) {
        return h('div', { key: i, className: 'signal-card signal-card-' + sig.impact },
          h('div', { className: 'signal-card-content' },
            h('div', { className: 'signal-card-type' }, sig.type),
            h('div', { className: 'signal-card-text' }, sig.text),
            h('div', { style: { display: 'flex', gap: 12, marginTop: 4 } },
              h('div', { className: 'signal-card-date' }, sig.date),
              h('div', { className: 'signal-card-impact ' + sig.impact },
                sig.impact === 'positive' ? 'Positive signal' : 'Negative signal')
            )
          )
        );
      })
    );
  };

  return h('div', { className: 'page-content' },
    h('div', { style: { fontWeight: 700, fontSize: 18, color: '#2E2E38', marginBottom: 4 } }, 'Dusty shelf — de-prioritized assets'),
    h('div', { style: { fontSize: 12, color: '#8F8FA3', marginBottom: 16 } }, 'Systematically review shelved assets against recent external signals. Assets with high rescue scores warrant re-presentation to the Indication Strategy Committee.'),
    h('div', { className: 'stats-row' },
      h(StatCard, { label: 'Shelved Assets', value: shelved.length, color: '', sub: 'in portfolio' }),
      h(StatCard, { label: 'New Signals', value: withSignals.length, color: 'warning', sub: 'assets with external signal since shelving' }),
      h(StatCard, { label: 'High Rescue Score', value: shelved.filter(function(c) { return dustyShelf[c.id] && dustyShelf[c.id].rescueScore >= 7; }).length, color: 'success', sub: 'assets scoring ≥7.0 rescue potential' })
    ),
    h('div', { className: 'section-card' },
      h('div', { className: 'section-card-header' },
        h('div', { className: 'section-card-title' }, 'Shelved asset rescue tracker'),
        h('div', { style: { fontSize: 11, color: '#8F8FA3' } }, 'Expand rows to view external change signals')
      ),
      h(Table, {
        dataSource: shelved, rowKey: 'id', size: 'small',
        columns: columns,
        expandable: { expandedRowRender: expandRender },
        pagination: false,
        style: { margin: '0 8px 8px' },
      })
    )
  );
}

/* ── AuditPage ────────────────────────────────────────────── */
function AuditPage(props) {
  var decisions = props.decisions, portfolio = props.portfolio, allIndications = props.allIndications;
  var _flt = useState(null); var filterDec = _flt[0]; var setFilterDec = _flt[1];
  var _snap = useState(null); var snapDec = _snap[0]; var setSnapDec = _snap[1];

  var cmpMap = useMemo(function() {
    var m = {};
    portfolio.forEach(function(c) { m[c.id] = c; });
    return m;
  }, [portfolio]);

  function findIndication(compoundId, indicationId) {
    var inds = allIndications[compoundId] || [];
    return inds.find(function(i) { return i.id === indicationId; });
  }

  var filtered = useMemo(function() {
    if (!filterDec) return decisions;
    return decisions.filter(function(d) { return d.decision === filterDec; });
  }, [decisions, filterDec]);

  var stats = useMemo(function() {
    var now = new Date();
    var thisQ = decisions.filter(function(d) {
      var dd = new Date(d.decidedAt);
      return dd.getFullYear() === now.getFullYear() && Math.floor(dd.getMonth() / 3) === Math.floor(now.getMonth() / 3);
    });
    return {
      total: decisions.length,
      advances: thisQ.filter(function(d) { return d.decision === 'advance'; }).length,
      kills:    thisQ.filter(function(d) { return d.decision === 'kill'; }).length,
      watches:  thisQ.filter(function(d) { return d.decision === 'watch'; }).length,
    };
  }, [decisions]);

  var columns = [
    { title: 'Date', dataIndex: 'decidedAt', key: 'date', width: 100,
      sorter: function(a, b) { return new Date(a.decidedAt) - new Date(b.decidedAt); },
      render: function(v) { return h('span', { style: { fontSize: 12 } }, formatDate(v)); } },
    { title: 'Compound', key: 'cmp', width: 120, render: function(_, rec) {
        var c = cmpMap[rec.compoundId];
        return c ? h('div', null,
          h('div', { style: { fontWeight: 600, fontSize: 12 } }, c.name),
          h('div', { style: { fontSize: 11, color: '#8F8FA3' } }, c.code)
        ) : h('span', null, rec.compoundId);
      } },
    { title: 'Indication', key: 'ind', render: function(_, rec) {
        var ind = findIndication(rec.compoundId, rec.indicationId);
        return h('div', null,
          h('div', { style: { fontWeight: 600 } }, ind ? ind.name : rec.indicationId),
          ind && h('span', { className: taCls(ind.ta) }, taLabel(ind.ta))
        );
      } },
    { title: 'Decision', dataIndex: 'decision', key: 'decision', width: 110,
      filters: [{ text: 'Advance', value: 'advance' }, { text: 'Kill', value: 'kill' }, { text: 'Watch', value: 'watch' }],
      onFilter: function(v, rec) { return rec.decision === v; },
      render: function(v) {
        var Ico = decisionIcon(v);
        return h('span', { className: decisionCls(v) },
          Ico ? h(Ico, { style: { fontSize: 11 } }) : null,
          decisionLabel(v)
        );
      } },
    { title: 'Rationale', dataIndex: 'rationale', key: 'rationale', ellipsis: true,
      render: function(v) { return h('span', { style: { fontSize: 12, color: '#65657B' } }, v); } },
    { title: 'Decided By', dataIndex: 'decidedBy', key: 'by', width: 140, ellipsis: true,
      render: function(v) { return h('span', { style: { fontSize: 12 } }, v); } },
    { title: '', key: 'snap', width: 80, render: function(_, rec) {
        if (!rec.evidenceSnapshot) return null;
        return h(Button, { size: 'small', type: 'link', onClick: function() { setSnapDec(rec); } }, 'View evidence');
      } },
  ];

  return h('div', { className: 'page-content' },
    h('div', { style: { fontWeight: 700, fontSize: 18, color: '#2E2E38', marginBottom: 4 } }, 'Decision audit trail'),
    h('div', { style: { fontSize: 12, color: '#8F8FA3', marginBottom: 16 } }, 'Every committee decision, pinned to the evidence snapshot at time of decision. Immutable record for governance.'),
    h('div', { className: 'stats-row' },
      h(StatCard, { label: 'Total Decisions', value: stats.total, color: 'primary', sub: 'all time' }),
      h(StatCard, { label: 'Advances (QTD)', value: stats.advances, color: 'success', sub: 'this quarter' }),
      h(StatCard, { label: 'Killed (QTD)',   value: stats.kills,    color: 'danger',  sub: 'this quarter' }),
      h(StatCard, { label: 'Watching (QTD)', value: stats.watches,  color: 'warning', sub: 'this quarter' })
    ),
    h('div', { className: 'section-card' },
      h('div', { className: 'section-card-header' },
        h('div', { className: 'section-card-title' }, 'Committee decisions (' + decisions.length + ')'),
        h('div', { style: { fontSize: 11, color: '#8F8FA3' } }, "Click 'View evidence' to see scores at time of decision")
      ),
      h(Table, {
        dataSource: filtered, rowKey: 'id', size: 'small',
        columns: columns,
        pagination: { pageSize: 15, size: 'small' },
        style: { margin: '0 8px 8px' },
      })
    ),
    h(Modal, {
      title: 'Evidence snapshot at time of decision',
      open: !!snapDec,
      onCancel: function() { setSnapDec(null); },
      footer: h(Button, { onClick: function() { setSnapDec(null); } }, 'Close'),
    },
      snapDec && h('div', null,
        h('div', { style: { marginBottom: 12 } },
          h('div', { style: { fontSize: 11, color: '#8F8FA3' } }, 'Decision recorded: ' + formatDate(snapDec.decidedAt)),
          h('div', { style: { fontSize: 14, fontWeight: 600, marginTop: 2 } }, decisionLabel(snapDec.decision)),
          h('div', { style: { fontSize: 12, color: '#65657B', marginTop: 4 } }, snapDec.rationale)
        ),
        h(Divider, null),
        snapDec.evidenceSnapshot && h(AxisRows, { scores: snapDec.evidenceSnapshot })
      )
    )
  );
}

/* ── Debug Panel ──────────────────────────────────────────── */
function DebugPanel(props) {
  var appState = props.appState;
  var _open = useState(_debugEnabled); var open = _open[0]; var setOpen = _open[1];
  var _tab = useState('logs'); var tab = _tab[0]; var setTab = _tab[1];
  var _tick = useState(0); var setTick = _tick[1];

  useEffect(function() {
    var fn = function() { setTick(function(t) { return t + 1; }); };
    _debugListeners.push(fn);
    return function() {
      var idx = _debugListeners.indexOf(fn);
      if (idx !== -1) _debugListeners.splice(idx, 1);
    };
  }, []);

  useEffect(function() {
    function onKey(e) {
      if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setOpen(function(v) { return !v; });
      }
    }
    window.addEventListener('keydown', onKey);
    return function() { window.removeEventListener('keydown', onKey); };
  }, []);

  function statusColor(s) {
    if (!s || s === 'ERR') return '#FF6B6B';
    if (s >= 400) return '#FF6B6B';
    if (s >= 300) return '#FFD166';
    return '#6BD66B';
  }

  var errorCount = _debugLogs.filter(function(l) { return l.type === 'error'; }).length;
  var warnCount  = _debugLogs.filter(function(l) { return l.type === 'warn'; }).length;
  var pendingCount = _debugApiCalls.filter(function(c) { return c.pending; }).length;

  return h('div', null,
    h('button', {
      className: 'debug-fab',
      onClick: function() { setOpen(function(v) { return !v; }); },
      title: 'Debug panel (Ctrl+Shift+D)'
    },
      'Debug',
      errorCount > 0 && h('span', { className: 'debug-fab-err' }, errorCount)
    ),

    open && h('div', { className: 'debug-panel' },
      h('div', { className: 'debug-panel-header' },
        h('span', { className: 'debug-panel-title' }, 'Debug'),
        h('div', { className: 'debug-panel-tabs' },
          h('button', { className: 'debug-tab' + (tab === 'logs' ? ' active' : ''), onClick: function() { setTab('logs'); } },
            'Logs' + (errorCount || warnCount ? ' (' + (errorCount ? errorCount + ' err' : '') + (warnCount ? ' ' + warnCount + ' warn' : '').trim() + ')' : '')
          ),
          h('button', { className: 'debug-tab' + (tab === 'api' ? ' active' : ''), onClick: function() { setTab('api'); } },
            'API' + (pendingCount ? ' (' + pendingCount + '…)' : ' (' + _debugApiCalls.length + ')')
          ),
          h('button', { className: 'debug-tab' + (tab === 'state' ? ' active' : ''), onClick: function() { setTab('state'); } }, 'State')
        ),
        h('div', { className: 'debug-panel-actions' },
          h('button', { className: 'debug-action-btn', onClick: function() {
            if (tab === 'logs') _debugLogs.splice(0, _debugLogs.length);
            else if (tab === 'api') _debugApiCalls.splice(0, _debugApiCalls.length);
            setTick(function(t) { return t + 1; });
          }}, 'Clear'),
          h('button', { className: 'debug-action-btn', onClick: function() {
            var text = tab === 'logs'  ? JSON.stringify(_debugLogs, null, 2)     :
                       tab === 'api'   ? JSON.stringify(_debugApiCalls, null, 2) :
                                         JSON.stringify(appState, null, 2);
            navigator.clipboard && navigator.clipboard.writeText(text).then(function() {
              message.success('Copied to clipboard');
            });
          }}, 'Copy'),
          h('button', { className: 'debug-action-btn', onClick: function() {
            try { localStorage.setItem('repurposing_debug', open ? '0' : '1'); } catch(e) {}
            setOpen(false);
          }}, 'Persist'),
          h('button', { className: 'debug-close-btn', onClick: function() { setOpen(false); } }, 'Close')
        )
      ),

      h('div', { className: 'debug-panel-body' },
        tab === 'logs' && h('div', { className: 'debug-log-list' },
          _debugLogs.length === 0
            ? h('div', { className: 'debug-empty' }, 'No logs captured yet')
            : _debugLogs.map(function(entry) {
                return h('div', { key: entry.id, className: 'debug-log-entry debug-log-' + entry.type },
                  h('span', { className: 'debug-log-ts' }, entry.ts.slice(11, 19)),
                  h('span', { className: 'debug-log-level' }, entry.type.toUpperCase()),
                  h('span', { className: 'debug-log-msg' }, entry.msg)
                );
              })
        ),

        tab === 'api' && h('div', { className: 'debug-log-list' },
          _debugApiCalls.length === 0
            ? h('div', { className: 'debug-empty' }, 'No API calls yet')
            : _debugApiCalls.map(function(call) {
                return h('div', { key: call.id, className: 'debug-log-entry' },
                  h('span', { className: 'debug-log-ts' }, call.ts.slice(11, 19)),
                  h('span', { className: 'debug-method', style: { color: call.method === 'POST' ? '#FF8C42' : '#6BB5FF' } }, call.method),
                  h('span', { className: 'debug-log-msg' }, call.url),
                  call.pending
                    ? h('span', { className: 'debug-status pending' }, '…')
                    : h('span', { className: 'debug-status', style: { color: statusColor(call.status) } },
                        call.status + (call.duration != null ? '  ' + call.duration + 'ms' : '')
                      )
                );
              })
        ),

        tab === 'state' && h('div', { className: 'debug-state' },
          h('pre', { className: 'debug-state-pre' }, JSON.stringify(appState, null, 2))
        )
      )
    )
  );
}

/* ── Sidebar ──────────────────────────────────────────────── */
function Sidebar(props) {
  var activeTab = props.activeTab, onTabChange = props.onTabChange;

  var tabs = [
    { key: 'scanner',   label: 'Indication scanner', Icon: ExperimentOutlined },
    { key: 'dashboard', label: 'Portfolio dashboard', Icon: BarChartOutlined },
    { key: 'shelf',     label: 'Dusty shelf', Icon: InboxOutlined },
    { key: 'audit',     label: 'Decision audit', Icon: AuditOutlined },
  ];

  return h('div', { className: 'app-sidebar', 'data-tour': 'sidebar' },
    h('div', { className: 'sidebar-logo' },
      h('div', { className: 'sidebar-logo-title' }, 'Repurposing Scanner'),
      h('div', { className: 'sidebar-logo-sub' }, 'Cross-Disease Indication Intelligence')
    ),
    h('div', { className: 'sidebar-nav' },
      tabs.map(function(t) {
        return h('div', { key: t.key,
                          className: 'sidebar-nav-item' + (activeTab === t.key ? ' active' : ''),
                          onClick: function() { onTabChange(t.key); } },
          t.Icon ? h(t.Icon, { className: 'sidebar-nav-icon' }) : null,
          h('span', null, t.label)
        );
      })
    )
  );
}

/* ── App ──────────────────────────────────────────────────── */
function App() {
  var _tab = useState('scanner');    var activeTab = _tab[0]; var setActiveTab = _tab[1];
  var _dum = useState(true);         var useDummy = _dum[0];  var setUseDummy = _dum[1];
  var _con = useState(false);        var connected = _con[0]; var setConnected = _con[1];
  var _ini = useState(true);         var initializing = _ini[0]; var setInitializing = _ini[1];
  var _dec = useState(MOCK_DECISIONS.slice()); var decisions = _dec[0]; var setDecisions = _dec[1];

  var defaultWeights = { biologicalPlausibility: 20, unmetNeed: 20, competitiveWhitespace: 20,
                         translationalFeasibility: 20, commercialAttractiveness: 20 };
  var _wt = useState(defaultWeights);
  var weights = _wt[0]; var setWeights = _wt[1];

  useEffect(function() {
    apiGet('api/health').then(function(data) {
      if (data && data.status === 'ok' && data.connected) setConnected(true);
    }).catch(function() { /* stay in dummy mode */ })
      .finally(function() { setInitializing(false); });
  }, []);

  function handleToggleDummy(val) {
    setUseDummy(val);
    if (!val && !connected) {
      message.warning('Not connected to Domino backend — live data unavailable. Switching back to demo data.');
      setUseDummy(true);
    }
  }

  function handleDecision(data) {
    var dec = Object.assign({ id: 'dec-' + Date.now(), decidedAt: new Date().toISOString() }, data);
    setDecisions(function(prev) { return [dec].concat(prev); });
    if (!useDummy && connected) {
      apiPost('api/decisions', data).catch(function() {});
    }
  }

  var tabHeaders = { scanner: 'Indication scanner', dashboard: 'Portfolio dashboard',
                     shelf: 'Dusty shelf', audit: 'Decision audit trail' };

  var _abt = useState(false); var aboutOpen = _abt[0]; var setAboutOpen = _abt[1];
  var _pre = useState(null); var preselect = _pre[0]; var setPreselect = _pre[1];

  function handleDashboardNavigate(compoundId, indicationId) {
    setPreselect({ compoundId: compoundId, indicationId: indicationId, token: Date.now() });
    setActiveTab('scanner');
  }

  var _tr = useState(-1); var tourStep = _tr[0]; var setTourStep = _tr[1];
  useEffect(function() {
    try {
      if (!localStorage.getItem('repurposing_tour_seen')) {
        setTimeout(function() { setTourStep(0); }, 600);
      }
    } catch(e) {}
  }, []);
  function endTour(completed) {
    setTourStep(-1);
    try { localStorage.setItem('repurposing_tour_seen', completed ? 'completed' : 'dismissed'); } catch(e) {}
  }

  var debugState = {
    activeTab: activeTab, useDummy: useDummy, connected: connected,
    decisionsCount: decisions.length, weights: weights,
    mockPortfolioCount: MOCK_PORTFOLIO.length,
    mockIndicationsCount: MOCK_INDICATIONS.length,
    mockDossierKeys: Object.keys(MOCK_DOSSIERS || {}),
  };

  return h(ConfigProvider, { theme: dominoTheme },
    h('div', { className: 'app-root app-layout-no-topnav' },
      h(DebugPanel, { appState: debugState }),
      h(Sidebar, { activeTab: activeTab, onTabChange: setActiveTab }),
      h('div', { className: 'app-main' },
        h('div', { className: 'app-header' },
          h('div', { className: 'app-header-title' }, tabHeaders[activeTab] || activeTab),
          h('div', { className: 'app-header-right', 'data-tour': 'header' },
            h(Button, { type: 'text', size: 'small',
                        onClick: function() { setActiveTab('scanner'); setTourStep(0); },
                        className: 'about-link', 'data-tour': 'tour-btn' }, 'Take a tour'),
            h(Button, { type: 'text', size: 'small',
                        icon: InfoCircleOutlined ? h(InfoCircleOutlined, null) : null,
                        onClick: function() { setAboutOpen(true); },
                        className: 'about-link' }, 'About'),
            connected && !useDummy
              ? h(Tag, { color: 'green', className: 'header-status-tag' }, 'Live')
              : h(Tag, { color: 'orange', className: 'header-status-tag' }, 'Demo data'),
            !connected && h('div', { className: 'dummy-data-toggle' },
              h('span', { className: 'dummy-data-toggle-label' }, 'Demo data'),
              h(Tooltip, { title: useDummy
                  ? 'Using built-in mock portfolio. Toggle off to attempt live Domino data.'
                  : 'Domino backend unreachable. Toggle on to fall back to demo data.' },
                h(Switch, { checked: useDummy, onChange: handleToggleDummy, size: 'small' })
              )
            )
          )
        ),
        h('div', { className: 'app-content' },
          initializing
            ? h('div', { className: 'app-initializing' },
                h(Spin, { size: 'large', tip: 'Loading portfolio…' })
              )
            : null,
          !initializing && activeTab === 'scanner' && h(ScannerPage, {
            portfolio: MOCK_PORTFOLIO,
            allIndications: MOCK_INDICATIONS,
            allDossiers: MOCK_DOSSIERS,
            weights: weights, onWeightsChange: setWeights,
            onDecisionRecord: handleDecision,
            useDummy: useDummy,
            preselect: preselect,
          }),
          !initializing && activeTab === 'dashboard' && h(DashboardPage, {
            portfolio: MOCK_PORTFOLIO,
            allIndications: MOCK_INDICATIONS,
            weights: weights,
            onNavigate: handleDashboardNavigate,
          }),
          !initializing && activeTab === 'shelf' && h(DustyShelfPage, {
            portfolio: MOCK_PORTFOLIO,
            dustyShelf: MOCK_DUSTY_SHELF,
          }),
          !initializing && activeTab === 'audit' && h(AuditPage, {
            decisions: decisions,
            portfolio: MOCK_PORTFOLIO,
            allIndications: MOCK_INDICATIONS,
          })
        )
      ),
      h(AboutModal, { open: aboutOpen, onClose: function() { setAboutOpen(false); } }),
      tourStep >= 0 && h(TourWizard, {
        step: tourStep,
        onStep: function(s) {
          if (s === 0 || s === 1 || s === 2 || s === 3 || s === 4 || s === 5) setActiveTab('scanner');
          setTourStep(s);
        },
        onClose: endTour,
      })
    )
  );
}

/* ── Tour Wizard ──────────────────────────────────────────── */
var TOUR_STEPS = [
  { target: null, placement: 'center',
    title: 'Welcome to Repurposing Scanner',
    body: 'Systematically rank every compound in your portfolio against thousands of candidate indications — five weighted scoring axes, committee-ready dossiers, and a defensible audit trail. Takes about 90 seconds to walk through.' },
  { target: '[data-tour="sidebar"]', placement: 'right',
    title: 'Four connected workspaces',
    body: 'Indication scanner (where you\'ll spend most of your time), Portfolio dashboard (top candidates across all assets), Dusty shelf (re-evaluate de-prioritized compounds), and Decision audit (immutable committee record).' },
  { target: '[data-tour="portfolio"]', placement: 'right',
    title: 'Start with a compound',
    body: 'Pick any asset from your portfolio. Active and shelved compounds are grouped separately. The Scanner will immediately rank every candidate indication for it.' },
  { target: '[data-tour="weights"]', placement: 'bottom',
    title: 'Tune the five scoring axes',
    body: 'Adjust the weight sliders — biological plausibility, unmet need, competitive whitespace, translational feasibility, commercial attractiveness. The ranking re-sorts live so the committee can explore tradeoffs in the room.' },
  { target: '[data-tour="indications"]', placement: 'top',
    title: 'Ranked candidate indications',
    body: 'Each row is a compound × indication pair with composite score, per-axis sub-scores, and competitive context. Click any row to open its dossier on the right.' },
  { target: '[data-tour="dossier"]', placement: 'left',
    title: 'Committee-ready dossier',
    body: 'AI-drafted rationale with citations, evidence graph, and competitive landscape. Record an Advance / Watch / Kill decision — it\'s pinned to the exact scores and evidence at that moment.' },
  { target: '[data-tour="header"]', placement: 'bottom',
    title: 'Switch data sources anytime',
    body: 'Toggle between Demo data (built-in mock portfolio) and Live data (connected Domino backend). Re-launch this tour any time from the "Take a tour" link in the header.' },
];

function TourWizard(props) {
  var step = props.step;
  var cfg = TOUR_STEPS[step];
  var _r = useState({ tick: 0 }); var rerender = _r[1];

  useEffect(function() {
    // Auto-select a compound so downstream anchor targets exist
    if (step >= 3 && step <= 5) {
      if (!document.querySelector('[data-tour="weights"]')) {
        var firstCmp = document.querySelector('.compound-item');
        if (firstCmp) firstCmp.click();
      }
    }
    // Auto-select first indication row so dossier is populated
    if (step === 5) {
      setTimeout(function() {
        if (!document.querySelector('.dossier-content')) {
          var firstRow = document.querySelector('.indication-table-wrap .ant-table-row');
          if (firstRow) firstRow.click();
        }
        rerender({ tick: Date.now() });
      }, 120);
    }
    function onResize() { rerender({ tick: Date.now() }); }
    function onKey(e) { if (e.key === 'Escape') props.onClose(false); }
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey);
    var t = setTimeout(onResize, 80);
    return function() {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [step]);

  var rect = null;
  if (cfg.target) {
    var el = document.querySelector(cfg.target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      rect = el.getBoundingClientRect();
    }
  }

  var isLast = step === TOUR_STEPS.length - 1;
  var isFirst = step === 0;

  var pad = 8;
  var spotlight = rect ? {
    position: 'fixed',
    top: (rect.top - pad) + 'px',
    left: (rect.left - pad) + 'px',
    width: (rect.width + pad * 2) + 'px',
    height: (rect.height + pad * 2) + 'px',
    borderRadius: '8px',
    boxShadow: '0 0 0 9999px rgba(46, 46, 56, 0.55)',
    pointerEvents: 'none',
    zIndex: 10000,
    transition: 'all 0.25s ease',
  } : null;

  var popoverStyle = { position: 'fixed', zIndex: 10001, width: 380 };
  if (!rect || cfg.placement === 'center') {
    popoverStyle.top = '50%'; popoverStyle.left = '50%';
    popoverStyle.transform = 'translate(-50%, -50%)';
    popoverStyle.width = 460;
  } else {
    var gap = 16;
    if (cfg.placement === 'right') {
      popoverStyle.top = Math.max(16, rect.top) + 'px';
      popoverStyle.left = (rect.right + gap) + 'px';
    } else if (cfg.placement === 'left') {
      popoverStyle.top = Math.max(16, rect.top) + 'px';
      popoverStyle.left = (rect.left - gap - 380) + 'px';
    } else if (cfg.placement === 'bottom') {
      popoverStyle.top = (rect.bottom + gap) + 'px';
      popoverStyle.left = Math.max(16, Math.min(window.innerWidth - 396, rect.left)) + 'px';
    } else if (cfg.placement === 'top') {
      popoverStyle.top = Math.max(16, rect.top - gap - 220) + 'px';
      popoverStyle.left = Math.max(16, Math.min(window.innerWidth - 396, rect.left)) + 'px';
    }
  }

  var backdrop = !rect ? h('div', {
    className: 'tour-backdrop',
    onClick: function() { props.onClose(false); },
  }) : null;

  return h(Fragment, null,
    backdrop,
    spotlight && h('div', { style: spotlight }),
    h('div', { className: 'tour-popover', style: popoverStyle },
      h('div', { className: 'tour-progress' }, 'Step ' + (step + 1) + ' of ' + TOUR_STEPS.length),
      h('div', { className: 'tour-title' }, cfg.title),
      h('div', { className: 'tour-body' }, cfg.body),
      h('div', { className: 'tour-actions' },
        h(Button, { type: 'text', size: 'small', onClick: function() { props.onClose(false); } }, 'Skip tour'),
        h('div', { className: 'tour-actions-right' },
          !isFirst && h(Button, { size: 'small', onClick: function() { props.onStep(step - 1); }, style: { marginRight: 8 } }, 'Back'),
          h(Button, { type: 'primary', size: 'small',
            onClick: function() {
              if (isLast) props.onClose(true);
              else props.onStep(step + 1);
            }
          }, isLast ? 'Finish' : 'Next')
        )
      )
    )
  );
}

/* ── About Modal ──────────────────────────────────────────── */
function AboutModal(props) {
  return h(Modal, {
    open: props.open,
    onCancel: props.onClose,
    footer: h(Button, { type: 'primary', onClick: props.onClose }, 'Got it'),
    title: h('div', { className: 'about-modal-title' },
      InfoCircleOutlined ? h(InfoCircleOutlined, { style: { color: '#543FDE' } }) : null,
      h('span', null, 'About Repurposing Scanner')
    ),
    width: 720,
  },
    h('div', { className: 'about-modal-body' },
      h('p', { className: 'about-lede' },
        'A committee-ready workspace for translational leads evaluating their compound portfolio ',
        'against thousands of candidate indications on five weighted axes.'
      ),
      h('div', { className: 'about-section about-plain' },
        h('div', { className: 'about-section-title' }, 'In plain terms'),
        h('div', { className: 'plain-grid' },
          h('div', { className: 'plain-card' },
            h('div', { className: 'plain-card-title' }, 'What is this app for?'),
            h('p', null,
              'Pharma companies own drug candidates (compounds) that were developed for one disease but could potentially treat others. ',
              'This app helps Translational Medicine leads and portfolio committees systematically ask: ',
              h('em', null, 'which of our compounds could also work for which other diseases, and which of those bets are worth pursuing?')
            )
          ),
          h('div', { className: 'plain-card' },
            h('div', { className: 'plain-card-title' }, 'Why is it valuable?'),
            h('p', null,
              'Drug discovery takes 10+ years and costs billions. Repurposing an existing compound for a new indication skips most of the safety work, ',
              'cutting years and cost. The hard part is ranking hundreds of possible matches by biology, unmet need, competition, feasibility, and commercial fit ',
              'so the committee can invest in the strongest few.'
            )
          ),
          h('div', { className: 'plain-card' },
            h('div', { className: 'plain-card-title' }, 'How is it done today?'),
            h('p', null,
              'Mostly by hand: a scientist reads literature, pulls competitor data from subscription databases, builds a spreadsheet scoring a handful of indications, ',
              'and writes a slide dossier. Each compound takes weeks. Shelved assets rarely get re-examined unless someone champions them. ',
              'Committee decisions are recorded in meeting minutes, not tied back to the evidence that informed them.'
            )
          ),
          h('div', { className: 'plain-card' },
            h('div', { className: 'plain-card-title' }, 'How does this make it easier?'),
            h('ul', { className: 'plain-list' },
              h('li', null, h('strong', null, 'Breadth: '), 'scores every compound against dozens of indications automatically, not just the few a scientist thought to check.'),
              h('li', null, h('strong', null, 'Speed: '), 'tuning the weight sliders re-ranks the list instantly, so a committee can explore tradeoffs live in the room.'),
              h('li', null, h('strong', null, 'Dossiers on demand: '), 'the right panel drafts a committee-ready rationale with citations, evidence graph, and competitive landscape in one click.'),
              h('li', null, h('strong', null, 'Shelved assets stay active: '), 'the Dusty shelf flags de-prioritized compounds when external signals (new biomarker, competitor failure) change the case for them.'),
              h('li', null, h('strong', null, 'Defensible audit trail: '), 'every Advance / Watch / Kill decision is pinned to the exact scores and evidence at the time it was made.')
            )
          )
        )
      ),
      h('div', { className: 'about-section' },
        h('div', { className: 'about-section-title' }, 'What you can do'),
        h('ul', { className: 'about-list' },
          h('li', null, h('strong', null, 'Indication scanner'), ' — pick a compound, tune the five scoring-axis weights, and watch the ranked indication list re-sort in real time. Click Open to read the full dossier.'),
          h('li', null, h('strong', null, 'Portfolio dashboard'), ' — see the top-10 repurposing candidates across every compound, with the therapeutic-area breakdown.'),
          h('li', null, h('strong', null, 'Dusty shelf'), ' — systematically re-evaluate de-prioritized assets against external signals that have emerged since shelving.'),
          h('li', null, h('strong', null, 'Decision audit'), ' — an immutable record of committee decisions, each pinned to the evidence snapshot that informed it.')
        )
      ),
      h('div', { className: 'about-section' },
        h('div', { className: 'about-section-title' }, 'Scoring axes'),
        h('ul', { className: 'about-list' },
          h('li', null, h('strong', null, 'Biological plausibility'), ' — target/mechanism fit, preclinical evidence'),
          h('li', null, h('strong', null, 'Unmet need'), ' — disease burden, standard-of-care gaps'),
          h('li', null, h('strong', null, 'Competitive whitespace'), ' — competitor programs by phase, patent runway'),
          h('li', null, h('strong', null, 'Translational feasibility'), ' — biomarker readiness, trial design'),
          h('li', null, h('strong', null, 'Commercial attractiveness'), ' — market size, payer dynamics')
        )
      ),
      h('div', { className: 'about-section' },
        h('div', { className: 'about-section-title' }, 'How this becomes real on Domino'),
        h('p', { className: 'about-sub' },
          'The POC runs on bundled demo data. Production deployment maps every capability to a concrete Domino surface:'
        ),
        h('div', { className: 'integrations-grid' },
          h(IntegrationCard, {
            title: 'Data sources',
            items: [
              'Domino Datasets and Data Sources connect internal portfolio databases (compound library, CMC, preclinical PK/PD) and external feeds — ChEMBL, Open Targets, ClinicalTrials.gov, MONDO, DrugBank, GlobalData, Cortellis — as mounted paths inside the Workspace.',
              'Snowflake / Databricks / S3 connectors pull competitive-intel and patent data on a scheduled refresh.',
              'Domino Flows orchestrates the nightly ETL that re-scores every compound × indication pair.'
            ]
          }),
          h(IntegrationCard, {
            title: 'Model APIs',
            items: [
              'Indication-ranking model deployed as a Domino Model API: input = compound ID + weight vector, output = ranked list with per-axis sub-scores. The Scanner calls it on every slider change.',
              'Target–disease association scorer and competitive-whitespace estimator each live as separate Model APIs so the Ranker can compose them.',
              'Dusty-shelf "rescue score" is its own model endpoint, retrained when new external signals land.'
            ]
          }),
          h(IntegrationCard, {
            title: 'LLM and Domino Extensions',
            items: [
              'Dossier drafting uses a tenant-private Claude endpoint exposed via a Domino Extension — prompts stay inside the Domino network boundary.',
              'Evidence-graph RAG pulls citations from an internal literature index (PubMed + internal reports) through a Vector Store Extension.',
              'Committee-brief export renders the dossier to PDF through a shared Workspace template.'
            ]
          }),
          h(IntegrationCard, {
            title: 'MLOps — monitoring and retraining',
            items: [
              'Scheduled Jobs re-score the full portfolio weekly; Flows triggers retraining when new Open Targets or ClinicalTrials.gov data lands.',
              'Model Monitoring tracks prediction drift per scoring axis and fires alerts when the axis distribution shifts beyond threshold.',
              'Experiment Manager captures each retraining run, tying hyperparameters and data snapshot to the deployed Model API version.'
            ]
          }),
          h(IntegrationCard, {
            title: 'Governance and audit',
            items: [
              'Every committee decision creates an entry in Domino Governance tied to the model version, data snapshot, and signed-off evidence bundle.',
              'Policy-based approvals gate promoting a candidate from Watch to Advance — required reviewers defined per therapeutic area.',
              'Immutable lineage: scores, weights, and dossier text at the time of decision are preserved so the audit trail is defensible.'
            ]
          }),
          h(IntegrationCard, {
            title: 'Users, access, and cost',
            items: [
              'Workspace access and scoped Project roles control which portfolio a lead can see (oncology vs. immunology vs. rare disease).',
              'SSO / SAML integration for identity; PATs for service-to-service calls into the Model APIs.',
              'Compute Environments pin the exact Python / R versions for reproducibility; GPU tiers reserved for LLM-heavy dossier drafting only.'
            ]
          })
        )
      ),
      h(Alert, {
        type: 'info', showIcon: true,
        message: 'Proof-of-concept',
        description: 'Non-GxP. Dummy portfolio and indication data. Dossier text is AI-drafted and requires scientist review before use.',
      })
    )
  );
}

function IntegrationCard(props) {
  return h('div', { className: 'integration-card' },
    h('div', { className: 'integration-card-title' }, props.title),
    h('ul', { className: 'integration-card-list' },
      (props.items || []).map(function(it, i) { return h('li', { key: i }, it); })
    )
  );
}

/* ── Mount ────────────────────────────────────────────────── */
var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(App));
