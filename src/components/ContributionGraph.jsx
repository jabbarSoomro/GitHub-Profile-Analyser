import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './ContributionGraph.css';

export default function ContributionGraph({ activityByDate }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: '' });

  useEffect(() => {
    drawGraph();
    
    const handleResize = () => {
      drawGraph();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [activityByDate]);

  const drawGraph = () => {
    if (!svgRef.current || !containerRef.current) return;

    // Clear previous
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll('*').remove();

    // 1. Generate dates grid (13 weeks = 91 days)
    const today = new Date();
    const dates = [];
    
    // Find Sunday of 13 weeks ago
    const start = new Date(today);
    start.setDate(today.getDate() - 90); 
    const startDay = start.getDay(); // 0 is Sun, 6 is Sat
    start.setDate(start.getDate() - startDay); // Shift to Sunday of that week

    // Go up to today (padded to Saturday of current week)
    const end = new Date(today);
    const endDay = end.getDay();
    end.setDate(end.getDate() + (6 - endDay));

    const curr = new Date(start);
    while (curr <= end) {
      dates.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }

    // 2. Set dimensions
    const cellSize = 12;
    const cellGap = 3;
    const labelHeight = 20;
    const labelWidth = 30;

    const weeksCount = Math.ceil(dates.length / 7);
    const width = labelWidth + (weeksCount * (cellSize + cellGap));
    const height = labelHeight + (7 * (cellSize + cellGap)) + 10;

    // Set SVG size
    svgEl
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMinYMin meet');

    const chartGroup = svgEl.append('g')
      .attr('transform', `translate(${labelWidth}, ${labelHeight})`);

    // 3. Draw weekday labels on Y-axis (Mon, Wed, Fri)
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const displayDays = [1, 3, 5]; // Mon, Wed, Fri
    
    displayDays.forEach(dayIdx => {
      svgEl.append('text')
        .attr('x', labelWidth - 6)
        .attr('y', labelHeight + (dayIdx * (cellSize + cellGap)) + (cellSize / 2) + 4)
        .attr('text-anchor', 'end')
        .attr('class', 'weekday-label')
        .text(dayLabels[dayIdx]);
    });

    // 4. Calculate month labels for X-axis
    let lastMonth = -1;
    dates.forEach((date, index) => {
      const day = date.getDay();
      const month = date.getMonth();
      const weekIdx = Math.floor(index / 7);

      if (day === 0 && month !== lastMonth) {
        lastMonth = month;
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        chartGroup.append('text')
          .attr('x', weekIdx * (cellSize + cellGap))
          .attr('y', -6)
          .attr('class', 'month-label')
          .text(monthNames[month]);
      }
    });

    // 5. Draw cells
    const cells = chartGroup.selectAll('.day-cell')
      .data(dates)
      .enter()
      .append('rect')
      .attr('class', 'day-cell')
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('x', (d, i) => Math.floor(i / 7) * (cellSize + cellGap))
      .attr('y', (d) => d.getDay() * (cellSize + cellGap))
      .attr('rx', 2)
      .attr('ry', 2)
      .style('cursor', 'pointer');

    // 6. Color cell by contribution count
    const getColorClass = (count) => {
      if (!count || count === 0) return 'color-level-0';
      if (count <= 2) return 'color-level-1';
      if (count <= 5) return 'color-level-2';
      if (count <= 9) return 'color-level-3';
      return 'color-level-4';
    };

    cells
      .attr('class', d => {
        const dateStr = d.toISOString().split('T')[0];
        const count = activityByDate[dateStr] || 0;
        return `day-cell ${getColorClass(count)}`;
      });

    // Tooltip hover interactions
    cells.on('mousemove', (event, d) => {
      const dateStr = d.toISOString().split('T')[0];
      const count = activityByDate[dateStr] || 0;
      const formattedDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      
      const [mouseX, mouseY] = d3.pointer(event, containerRef.current);
      
      setTooltip({
        show: true,
        x: mouseX,
        y: mouseY - 42,
        content: `${count} contribution${count !== 1 ? 's' : ''} on ${formattedDate}`
      });
    });

    cells.on('mouseleave', () => {
      setTooltip(prev => ({ ...prev, show: false }));
    });
  };

  return (
    <div className="glass-panel heatmap-panel" ref={containerRef}>
      <div className="heatmap-header">
        <h3 className="panel-title">
          <svg className="panel-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Activity Heatmap
        </h3>
        <div className="heatmap-legend">
          <span>Less</span>
          <div className="legend-cells">
            <span className="legend-cell color-level-0"></span>
            <span className="legend-cell color-level-1"></span>
            <span className="legend-cell color-level-2"></span>
            <span className="legend-cell color-level-3"></span>
            <span className="legend-cell color-level-4"></span>
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="svg-container">
        <svg ref={svgRef}></svg>
      </div>

      {tooltip.show && (
        <div
          className="heatmap-tooltip"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}
