import { NextResponse } from "next/server";
import { JsonRpcProvider, Wallet } from "ethers";

const SHA256_HEX_REGEX = /^[0-9a-f]{64}$/i;

type SupportedNetwork = "sepolia" | "amoy";

type NetworkConfig = {
  rpcUrl: string;
  privateKey: string;
  explorerBaseUrl: string;
};

function getNetworkConfig(network: SupportedNetwork): NetworkConfig {
  if (network === "amoy") {
    const rpcUrl = ensureEnv("AMOY_RPC_URL", process.env.AMOY_RPC_URL);
    const privateKey = ensureEnv("AMOY_PRIVATE_KEY", process.env.AMOY_PRIVATE_KEY);
    return {
      rpcUrl,
      privateKey,
      explorerBaseUrl: "https://amoy.polygonscan.com/tx/",
    };
  }

  const rpcUrl = process.env.SEPOLIA_RPC_URL ?? "https://rpc.sepolia.org";
  const privateKey = ensureEnv("SEPOLIA_PRIVATE_KEY", process.env.SEPOLIA_PRIVATE_KEY);
  return {
    rpcUrl,
    privateKey,
    explorerBaseUrl: "https://sepolia.etherscan.io/tx/",
  };
}

function ensureEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function validateSha256Hex(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("`sha256Hex` must be a string.");
  }

  const trimmed = value.trim();
  if (!SHA256_HEX_REGEX.test(trimmed)) {
    throw new Error("`sha256Hex` must be a 64-character hexadecimal SHA-256 digest.");
  }

  return trimmed.toLowerCase();
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json." },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { error: "Request body must be a JSON object." },
      { status: 400 },
    );
  }

  const { sha256Hex, network } = body as {
    sha256Hex?: unknown;
    network?: unknown;
  };

  let digest: string;
  try {
    digest = validateSha256Hex(sha256Hex);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid digest." },
      { status: 400 },
    );
  }

  const requestedNetwork = typeof network === "string" ? network.toLowerCase() : undefined;
  if (requestedNetwork !== undefined && requestedNetwork !== "sepolia" && requestedNetwork !== "amoy") {
    return NextResponse.json(
      { error: "Unsupported network. Valid options are 'sepolia' (default) or 'amoy'." },
      { status: 400 },
    );
  }

  const targetNetwork: SupportedNetwork = requestedNetwork === "amoy" ? "amoy" : "sepolia";

  let config: NetworkConfig;
  try {
    config = getNetworkConfig(targetNetwork);
  } catch (error) {
    console.error("Anchor route configuration error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Server configuration error. Contact the administrator." },
      { status: 500 },
    );
  }

  try {
    const provider = new JsonRpcProvider(config.rpcUrl);
    const wallet = new Wallet(config.privateKey, provider);

    const tx = await wallet.sendTransaction({
      to: wallet.address,
      value: 0n,
      data: (`0x${digest}`) as `0x${string}`,
    });

    const receipt = await tx.wait(1);

    if (!receipt?.hash) {
      throw new Error("Transaction receipt missing hash.");
    }

    return NextResponse.json(
      {
        txHash: receipt.hash,
        explorer: `${config.explorerBaseUrl}${receipt.hash}`,
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Anchor route failure:", message);
    return NextResponse.json(
      { error: "Failed to anchor digest on-chain." },
      { status: 500 },
    );
  }
}

function methodNotAllowed() {
  return new NextResponse("Method not allowed.", {
    status: 405,
    headers: {
      Allow: "POST",
    },
  });
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const DELETE = methodNotAllowed;
