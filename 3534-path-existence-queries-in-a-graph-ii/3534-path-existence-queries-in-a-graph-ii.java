class Solution {
    static class Node {
        int val, idx;
        Node(int val, int idx) {
            this.val = val;
            this.idx = idx;
        }
    }
    public int[] pathExistenceQueries(int n, int[] nums, int maxDiff, int[][] queries) {
        int[] ans = new int[queries.length];
        int[] indexMap = new int[n];
        int[] sortedNums = new int[n];

        Node[] arr = new Node[n];
        for (int i = 0; i < n; i++)
            arr[i] = new Node(nums[i], i);
        Arrays.sort(arr, (a, b) -> Integer.compare(a.val, b.val));
        for (int i = 0; i < n; i++) {
            sortedNums[i] = arr[i].val;
            indexMap[arr[i].idx] = i;
        }
        int LOG = 32 - Integer.numberOfLeadingZeros(n);

        int[][] jump = new int[n][LOG + 1];

        int right = 0;
        for (int i = 0; i < n; i++) {
            while (right + 1 < n &&
                    sortedNums[right + 1] - sortedNums[i] <= maxDiff) {
                right++;
            }
            jump[i][0] = right;
        }
        for (int k = 1; k <= LOG; k++) {
            for (int i = 0; i < n; i++) {
                jump[i][k] = jump[jump[i][k - 1]][k - 1];
            }
        }
        for (int i = 0; i < queries.length; i++) {
            int u = indexMap[queries[i][0]];
            int v = indexMap[queries[i][1]];
            if (u > v) {
                int t = u;
                u = v;
                v = t;
            }
            int res = solve(jump, u, v, LOG);
            ans[i] = (res == Integer.MAX_VALUE) ? -1 : res;
        }
        return ans;
    }
    private int solve(int[][] jump, int start, int end, int LOG) {
        if (start == end)
            return 0;
        if (jump[start][0] >= end)
            return 1;
        if (jump[start][LOG] < end)
            return Integer.MAX_VALUE;
        int j = LOG;
        while (j >= 0 && jump[start][j] >= end)
            j--;
        return (1 << j) + solve(jump, jump[start][j], end, j);
    }
}