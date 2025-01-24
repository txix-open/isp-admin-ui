export interface TestType {
  comment?: string;
  createdAt: string;
  id: string;
  lastRunAt: string;
  name: string;
  description: string;
  projectId: string;
  scenario: ScenarioType
  status: string;
  updatedAt: string;
}

export interface ScenarioType {
  globalHeaders: Record<string, string>;
  pool: {
    dialTimeout: string;
    enableHttp2: boolean;
    enableKeepalive: boolean;
    maxIdleCons: number;
  };
  requests: {
    ammo: {
      endpoint: {
        method: string;
        url: string;
      };
      file: string;
      headers: Record<string, string>;
      iterable: boolean;
      templatedBody: boolean;
      type: string;
    };
    baseUrl: string;
    debug: boolean;
    discardResponseBody: boolean;
    name: string;
    timeout: string;
    type: string;
  }[];
  rps: {
    steps: {
      duration: string;
      from: number;
      step: number;
      to: number;
      type: string;
    }[];
    workers: number;
  };
}
export interface NewTestType {
  name: string
}

export interface PlayTestType extends Omit<TestType, 'projectId'> {
  dataOffset?: number;
}