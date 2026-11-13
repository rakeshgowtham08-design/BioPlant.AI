import { TrainingSample } from './dataset';

export interface TreeNode {
  isLeaf: boolean;
  featureIndex?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
  prediction?: string;
  probabilities?: Record<string, number>;
}

export class DecisionTree {
  private root: TreeNode | null = null;
  private maxDepth: number;
  private minSamplesSplit: number;
  private maxFeatures: number;

  constructor(maxDepth: number = 8, minSamplesSplit: number = 2, maxFeatures: number = 4) {
    this.maxDepth = maxDepth;
    this.minSamplesSplit = minSamplesSplit;
    this.maxFeatures = maxFeatures;
  }

  public train(samples: TrainingSample[], featureSubsetIndices?: number[]): void {
    this.root = this.buildTree(samples, 0, featureSubsetIndices);
  }

  private calculateGini(samples: TrainingSample[]): number {
    if (samples.length === 0) return 0;
    const counts: Record<string, number> = {};
    for (const sample of samples) {
      counts[sample.label] = (counts[sample.label] || 0) + 1;
    }
    let sumSquares = 0;
    for (const label in counts) {
      const p = counts[label] / samples.length;
      sumSquares += p * p;
    }
    return 1 - sumSquares;
  }

  private buildTree(
    samples: TrainingSample[],
    depth: number,
    featureSubsetIndices?: number[]
  ): TreeNode {
    const counts: Record<string, number> = {};
    for (const sample of samples) {
      counts[sample.label] = (counts[sample.label] || 0) + 1;
    }

    let dominantLabel = '';
    let maxCount = -1;
    const probabilities: Record<string, number> = {};
    for (const label in counts) {
      probabilities[label] = counts[label] / samples.length;
      if (counts[label] > maxCount) {
        maxCount = counts[label];
        dominantLabel = label;
      }
    }

    // Leaf conditions: max depth, single class, or too few samples
    const currentGini = this.calculateGini(samples);
    if (
      depth >= this.maxDepth ||
      samples.length < this.minSamplesSplit ||
      currentGini === 0 ||
      Object.keys(counts).length <= 1
    ) {
      return {
        isLeaf: true,
        prediction: dominantLabel,
        probabilities
      };
    }

    // Feature selection (subsampling for Random Forest)
    const numFeatures = samples[0].features.length;
    let candidateFeatures: number[];
    if (featureSubsetIndices && featureSubsetIndices.length > 0) {
      candidateFeatures = featureSubsetIndices;
    } else {
      // Pick random subset of features
      const allIndices = Array.from({ length: numFeatures }, (_, i) => i);
      candidateFeatures = this.shuffle(allIndices).slice(0, this.maxFeatures);
    }

    let bestGini = Infinity;
    let bestFeature = -1;
    let bestThreshold = 0;
    let bestLeft: TrainingSample[] = [];
    let bestRight: TrainingSample[] = [];

    for (const featIdx of candidateFeatures) {
      // Extract unique values for this feature
      const values = Array.from(new Set(samples.map(s => s.features[featIdx]))).sort((a, b) => a - b);
      if (values.length <= 1) continue;

      // Test midpoints
      for (let i = 0; i < values.length - 1; i++) {
        const threshold = (values[i] + values[i + 1]) / 2;
        const left = samples.filter(s => s.features[featIdx] <= threshold);
        const right = samples.filter(s => s.features[featIdx] > threshold);

        if (left.length === 0 || right.length === 0) continue;

        const leftGini = this.calculateGini(left);
        const rightGini = this.calculateGini(right);
        const splitGini = (left.length / samples.length) * leftGini + (right.length / samples.length) * rightGini;

        if (splitGini < bestGini) {
          bestGini = splitGini;
          bestFeature = featIdx;
          bestThreshold = threshold;
          bestLeft = left;
          bestRight = right;
        }
      }
    }

    // If no valid split found that improves Gini, return leaf
    if (bestFeature === -1 || bestGini >= currentGini) {
      return {
        isLeaf: true,
        prediction: dominantLabel,
        probabilities
      };
    }

    return {
      isLeaf: false,
      featureIndex: bestFeature,
      threshold: bestThreshold,
      left: this.buildTree(bestLeft, depth + 1, featureSubsetIndices),
      right: this.buildTree(bestRight, depth + 1, featureSubsetIndices)
    };
  }

  public predictProbabilities(features: number[]): Record<string, number> {
    if (!this.root) throw new Error('Tree not trained.');
    return this.traverse(this.root, features);
  }

  private traverse(node: TreeNode, features: number[]): Record<string, number> {
    if (node.isLeaf || node.featureIndex === undefined || node.threshold === undefined) {
      return node.probabilities || { [node.prediction || 'Unknown']: 1.0 };
    }

    if (features[node.featureIndex] <= node.threshold) {
      return node.left ? this.traverse(node.left, features) : (node.probabilities || {});
    } else {
      return node.right ? this.traverse(node.right, features) : (node.probabilities || {});
    }
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

