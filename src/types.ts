export type createOpts = {
  projectName: string;
  templatePath: string;
  targetPath: string;
  templateChoice: string;
  benchmarkType: 'full' | 'runner_only'
}

export type answerOpts = {
  name: string;
  template: string;
  proceed: boolean;
  benchmark_type: 'runner only' | 'runner and viewer';
}