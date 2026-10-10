import { getBackend } from '../../../src/server/runtime.ts';

type Ctx = { params: Promise<{ path?: string[] }> };

async function delegate(request: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  const url = new URL(request.url);
  url.pathname = '/api/' + (path ?? []).join('/');
  return getBackend().handle(new Request(url, request));
}

export async function GET(request: Request, ctx: Ctx) { return delegate(request, ctx); }
export async function POST(request: Request, ctx: Ctx) { return delegate(request, ctx); }
export async function PUT(request: Request, ctx: Ctx) { return delegate(request, ctx); }
export async function PATCH(request: Request, ctx: Ctx) { return delegate(request, ctx); }
export async function DELETE(request: Request, ctx: Ctx) { return delegate(request, ctx); }
export async function HEAD(request: Request, ctx: Ctx) { return delegate(request, ctx); }
export async function OPTIONS(request: Request, ctx: Ctx) { return delegate(request, ctx); }
