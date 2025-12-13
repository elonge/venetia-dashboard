'use client';

import React, { useEffect, useRef, useState } from 'react';
import Timeline from 'react-visjs-timeline';
import type { VisTimelineItem, VisTimelineGroup } from '@/lib/timeline-transformers';
import 'vis-timeline/dist/vis-timeline-graph2d.min.css';

interface TimelineChartProps {
  items: VisTimelineItem[];
  groups?: VisTimelineGroup[];
  height?: string;
  startDate?: Date;
  endDate?: Date;
  onItemClick?: (item: VisTimelineItem, event: any) => void;
  onRangeChange?: (start: Date, end: Date) => void;
  variant?: 'compact' | 'modal';
  className?: string;
}

export default function TimelineChart({
  items,
  groups,
  height = '300px',
  startDate,
  endDate,
  onItemClick,
  onRangeChange,
  variant = 'compact',
  className = '',
}: TimelineChartProps) {
  const [timelineOptions, setTimelineOptions] = useState<any>({
    width: '100%',
    height: height,
    stack: false,
    showMajorLabels: true,
    showMinorLabels: true,
    showCurrentTime: false,
    zoomMin: 1000 * 60 * 60 * 24 * 30, // 30 days minimum
    zoomMax: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years maximum
    orientation: 'top',
    editable: false,
    selectable: true,
    multiselect: false,
    moveable: true,
    zoomable: true,
    format: {
      minorLabels: {
        year: 'YYYY',
        month: 'MMM YYYY',
        week: 'MMM D',
        day: 'D',
      },
      majorLabels: {
        year: 'YYYY',
        month: 'YYYY',
        week: 'MMM YYYY',
        day: 'MMM YYYY',
      },
    },
  });

  useEffect(() => {
    setTimelineOptions((prev: any) => ({
      ...prev,
      height: height,
      ...(startDate && endDate ? { start: startDate, end: endDate } : {}),
    }));
  }, [startDate, endDate, height]);

  const handleClick = (props: any) => {
    if (onItemClick && props.item) {
      const clickedItem = items.find((item) => item.id === props.item);
      if (clickedItem) {
        onItemClick(clickedItem, props);
      }
    }
  };

  const handleRangeChange = (props: any) => {
    if (onRangeChange && props.start && props.end) {
      onRangeChange(new Date(props.start), new Date(props.end));
    }
  };

  return (
    <div className={`timeline-container ${className}`}>
      <Timeline
        options={timelineOptions}
        items={items}
        groups={groups}
        clickHandler={handleClick}
        rangechangeHandler={handleRangeChange}
      />
    </div>
  );
}

