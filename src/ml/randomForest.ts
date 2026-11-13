import { TrainingSample } from './dataset';
import { DecisionTree } from './decisionTree';

export interface ForestConfig {
  numTrees: number;
  maxDepth: number;
  minSamplesSplit: number;
  maxFeatures: number;
}

export class RandomForestClassifier {
  private trees: DecisionTree[] = [];
  private classes: string[] = [];
  private isTrained: boolean = false;
  private config: ForestConfig;

  constructor(config?: Partial<ForestConfig>) {
    this.config = {
      numTrees: config?.numTrees ?? 35,
      maxDepth: config?.maxDepth ?? 7,
      minSamplesSplit: config?.minSamplesSplit ?? 2,
      maxFeatures: config?.maxFeatures ?? 4
    };
  }

  public fit(dataset: TrainingSample[]): void {
    if (!dataset || dataset.length === 0) {
      throw new Error('Dataset must contain training samples.');
    }

    // Collect all unique classes
    this.classes = Array.from(new Set(dataset.map(s => s.label))).sort();
    this.trees = [];

    const n = dataset.length;
    const numFeatures = dataset[0].features.length;

    for (let t = 0; t < this.config.numTrees; t++) {
      // 1. Bootstrap sample (sampling with replacement)
      const bootstrapSample: TrainingSample[] = [];
      for (let i = 0; i < n; i++) {
        const randomIndex = Math.floor(Math.random() * n);
        bootstrapSample.push(dataset[randomIndex]);
      }

      // 2. Select random subset of features for each tree
      const featureIndices = Array.from({ length: numFeatures }, (_, i) => i);
      const shuffledFeatures = this.shuffle(featureIndices).slice(0, this.config.maxFeatures);

      // 3. Train individual decision tree
      const tree = new DecisionTree(
        this.config.maxDepth,
        this.config.minSamplesSplit,
        this.config.maxFeatures
      );
      tree.train(bootstrapSample, shuffledFeatures);
      this.trees.push(tree);
    }

    this.isTrained = true;
  }

  public predict(features: number[]): {
    winner: string;
    confidence: number;
    distribution: { cropName: string; probability: number }[];
  } {
    if (!this.isTrained || this.trees.length === 0) {
      throw new Error('Random Forest model must be trained before inference.');
    }

    const aggregatedProbabilities: Record<string, number> = {};
    for (const c of this.classes) {
      aggregatedProbabilities[c] = 0;
    }

    // Aggregate probabilities from all trees (Bagging average)
    for (const tree of this.trees) {
      const treeProbs = tree.predictProbabilities(features);
      for (const [cls, prob] of Object.entries(treeProbs)) {
        if (aggregatedProbabilities[cls] !== undefined) {
          aggregatedProbabilities[cls] += prob / this.trees.length;
        }
      }
    }

    // Normalize probabilities to sum exactly to 1.0
    let totalProb = 0;
    for (const c of this.classes) {
      totalProb += aggregatedProbabilities[c];
    }
    if (totalProb > 0) {
      for (const c of this.classes) {
        aggregatedProbabilities[c] = aggregatedProbabilities[c] / totalProb;
      }
    }

    // Rank classes by probability
    const sortedClasses = Object.entries(aggregatedProbabilities)
      .map(([cropName, probability]) => ({
        cropName,
        probability: Math.round(probability * 1000) / 10 // e.g. 94.5%
      }))
      .sort((a, b) => b.probability - a.probability);

    const winner = sortedClasses[0].cropName;
    const confidence = sortedClasses[0].probability;

    return {
      winner,
      confidence,
      distribution: sortedClasses
    };
  }

  private shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

