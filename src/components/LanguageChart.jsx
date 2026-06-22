import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './LanguageChart.css';

// GitHub Official Language Colors (subset of common ones)
const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572a5',
  TypeScript: '#3178c6',
  Java: '#b07219',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  Go: '#00add8',
  PHP: '#4f5d95',
  Shell: '#89e051',
  Rust: '#dea584',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  C: '#555555'
};

export default function LanguageChart({ languages }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!languages || languages.length === 0 || !svgRef.current) return;

    // Redraw on window resize
    const handleResize = () => {
      drawChart();
    };

    window.addEventListener('resize', handleResize);
    drawChart();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [languages]);

  const drawChart = () => {
    if (!svgRef.current || !containerRef.current) return;

    // Clear previous renders
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll('*').remove();

    // Get current container width (max 320px for chart area, responsive)
    const containerWidth = containerRef.current.clientWidth;
    const width = Math.min(containerWidth - 40, 240);
    const height = width;
    const margin = 10;
    const radius = Math.min(width, height) / 2 - margin;

    // Select the top 5 languages, group others
    let data = [...languages];
    if (data.length > 5) {
      const top5 = data.slice(0, 5);
      const others = data.slice(5);
      const othersVal = others.reduce((sum, item) => sum + item.value, 0);
      const othersPct = others.reduce((sum, item) => sum + item.percentage, 0);
      
      data = [
        ...top5,
        { name: 'Other', value: othersVal, percentage: othersPct }
      ];
    }

    // Set SVG attributes
    svgEl
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const g = svgEl.select('g');

    // Create color scales
    const getColor = (name) => {
      if (name === 'Other') return '#64748b';
      return LANGUAGE_COLORS[name] || d3.interpolateRainbow(Math.random());
    };

    // Generate pie layout
    const pie = d3.pie()
      .value(d => d.percentage)
      .sort(null);

    // Generate arcs
    const arc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);

    const arcHover = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 1.06);

    // Enter selection
    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    // Add path elements with hover effects and animations
    const paths = arcs.append('path')
      .attr('fill', d => getColor(d.data.name))
      .attr('stroke', 'rgba(13, 20, 38, 0.8)')
      .attr('stroke-width', '2px')
      .style('cursor', 'pointer')
      .style('filter', 'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))');

    // Smooth transition entrance
    paths.transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t));
        };
      });

    // Add Tooltips / Text in Middle on Hover
    const centerText = g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.2em')
      .attr('class', 'center-title')
      .style('fill', 'var(--text-secondary)')
      .style('font-size', '0.75rem')
      .style('text-transform', 'uppercase')
      .text('Languages');

    const centerValue = g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.9em')
      .attr('class', 'center-value')
      .style('fill', 'var(--text-primary)')
      .style('font-weight', '700')
      .style('font-size', '1.1rem')
      .text(`${languages.length}`);

    paths.on('mouseenter', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('d', arcHoverHover => arcHover(d));

      centerText
        .transition()
        .duration(150)
        .style('opacity', 0.8)
        .text(d.data.name);

      centerValue
        .transition()
        .duration(150)
        .text(`${d.data.percentage}%`);
    });

    paths.on('mouseleave', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('d', arcReset => arc(d));

      centerText
        .transition()
        .duration(150)
        .text('Languages');

      centerValue
        .transition()
        .duration(150)
        .text(`${languages.length}`);
    });
  };

  const getLanguageColor = (name) => {
    if (name === 'Other') return '#64748b';
    return LANGUAGE_COLORS[name] || '#7c3aed';
  };

  return (
    <div className="glass-panel language-chart-panel animate-fade-in" ref={containerRef}>
      <h3 className="panel-title">Top Languages</h3>
      
      {languages.length === 0 ? (
        <div className="empty-state">No programming languages found.</div>
      ) : (
        <div className="chart-layout">
          <div className="svg-wrapper">
            <svg ref={svgRef}></svg>
          </div>
          
          <div className="legend-grid">
            {languages.slice(0, 6).map((lang, index) => (
              <div key={index} className="legend-item">
                <span
                  className="legend-color-dot"
                  style={{ backgroundColor: getLanguageColor(lang.name) }}
                ></span>
                <span className="legend-name">{lang.name}</span>
                <span className="legend-pct">{lang.percentage}%</span>
              </div>
            ))}
            {languages.length > 6 && (
              <div className="legend-item muted">
                <span className="legend-color-dot" style={{ backgroundColor: '#64748b' }}></span>
                <span className="legend-name">Others</span>
                <span className="legend-pct">
                  {languages.slice(6).reduce((sum, l) => sum + l.percentage, 0)}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
