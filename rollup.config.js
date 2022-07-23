import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/main.ts',
  output: {
    file: 'twitch.js',
    format: 'iife'
  },
  plugins: [typescript()]
};