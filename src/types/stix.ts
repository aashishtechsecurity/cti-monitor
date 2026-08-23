export interface StixHeader {
  type: string;
  spec_version: string;
  id: string;
  created: string;
  modified: string;
}

export interface StixIndicator extends StixHeader {
  type: 'indicator';
  name: string;
  description?: string;
  pattern: string;
  pattern_type: 'stix';
  valid_from: string;
  labels?: string[];
}

export interface StixMalware extends StixHeader {
  type: 'malware';
  name: string;
  description?: string;
  is_family: boolean;
  malware_types?: string[];
}

export interface StixThreatActor extends StixHeader {
  type: 'threat-actor';
  name: string;
  threat_actor_types?: string[];
  aliases?: string[];
  goals?: string[];
}

export interface StixVulnerability extends StixHeader {
  type: 'vulnerability';
  name: string;
  description?: string;
  external_references?: Array<{
    source_name: string;
    external_id: string;
  }>;
}

export interface StixBundle {
  type: 'bundle';
  id: string;
  objects: Array<StixIndicator | StixMalware | StixThreatActor | StixVulnerability>;
}
