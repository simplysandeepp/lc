class Solution {
    public int maximalSquare(char[][] matrix) {
        int m = matrix.length;
        int n = matrix[0].length;

        int[] prev = new int[n];
        int maxSide = 0;

        for(int i = 0; i < m; i++){
            int[] curr = new int[n];

            for(int j = 0; j < n; j++){
                if(matrix[i][j] == '1'){
                    if(i == 0 || j == 0){
                        curr[j] = 1;
                    }else{
                        curr[j] = 1 + Math.min(prev[j], Math.min(curr[j-1], prev[j-1]));
                    }
                    maxSide = Math.max(maxSide, curr[j]);
                }
            }
            prev = curr;
        }
        return maxSide * maxSide;
    }
}