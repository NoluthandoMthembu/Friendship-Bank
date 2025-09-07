const nextConfig = {
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/YOUR_MANIFEST_ID', // You'll replace this with your actual manifest ID
        permanent: false,
      },
    ];
  },
};

export default nextConfig;