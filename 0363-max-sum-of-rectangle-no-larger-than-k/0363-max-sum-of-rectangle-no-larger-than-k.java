class Solution {

    public int maxSumSubmatrix(int[][] matrix, int k) {

        int rows = matrix.length;
        int cols = matrix[0].length;
        int answer = Integer.MIN_VALUE;

        for (int left = 0; left < cols; left++) {

            int[] rowSum = new int[rows];

            for (int right = left; right < cols; right++) {

                for (int row = 0; row < rows; row++) {
                    rowSum[row] += matrix[row][right];
                }

                int currentMax = maxSubArrayNoGreaterThanK(rowSum, k);
                answer = Math.max(answer, currentMax);

                if (answer == k) {
                    return answer;
                }
            }
        }

        return answer;
    }

    private int maxSubArrayNoGreaterThanK(int[] nums, int k) {

        TreeSet<Integer> prefixSums = new TreeSet<>();
        prefixSums.add(0);

        int prefixSum = 0;
        int maxSum = Integer.MIN_VALUE;

        for (int num : nums) {

            prefixSum += num;

            Integer previousPrefix = prefixSums.ceiling(prefixSum - k);

            if (previousPrefix != null) {
                maxSum = Math.max(maxSum, prefixSum - previousPrefix);
            }

            prefixSums.add(prefixSum);
        }

        return maxSum;
    }
}