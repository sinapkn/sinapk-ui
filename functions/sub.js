export async function onRequest(context) {

  const origin = new URL(context.request.url).origin;

  const servers = await fetch(
    `${origin}/servers.json`
  ).then(r => r.json());

  const result = servers
    .map(server => server.link)
    .join('\n');

  return new Response(result,{
    headers:{
      'Content-Type':'text/plain;charset=utf-8'
    }
  });

}