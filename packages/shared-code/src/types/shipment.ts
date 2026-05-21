export interface ShipmentTimelineStep {
  status: string;
  label: string;
  completed: boolean;
  active: boolean;
  occurredAt?: string | null;
}

export interface ShipmentTimeline {
  orderId: number;
  shipmentId?: number | null;
  hasShipment: boolean;
  currentStatus?: string | null;
  currentStatusLabel: string;
  trackingNumber?: string | null;
  lastUpdatedAt?: string | null;
  steps: ShipmentTimelineStep[];
}

export interface ShipmentUpdateRequest {
  status: string;
  trackingNumber?: string;
}
