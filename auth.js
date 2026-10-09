"use strict";
const BP_URL="https://euyysueexzuzsbwvdaee.supabase.co";
const BP_KEY="sb_publishable_0lgkOlhXrvMYvJb-gS0qXg_kR5yVfPY";
const bpClient=window.supabase.createClient(BP_URL,BP_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
window.bpClient=bpClient;
let activeUser=null;
async function getActiveUser(){const {data:{user},error}=await bpClient.auth.getUser();if(error)return null;return user}
async function setupAuth(){
const box=document.createElement('div');box.id='authGateway';
box.innerHTML='<form id="authForm" class="auth-card"><div class="auth-brand">Laboratório <b>Bom Pastor</b></div><h1>Área médica</h1><p>Acesse suas requisições e check-ups com sua conta.</p><label>E-mail<input id="authEmail" type="email" autocomplete="email" required></label><label>Senha<input id="authPassword" type="password" autocomplete="current-password" required></label><button class="primary fullbtn" type="submit">Entrar</button><p id="authError" role="alert"></p><small>Para criar uma conta, solicite acesso ao administrador.</small></form>';
document.body.append(box);
const css=document.createElement('style');css.textContent='#authGateway{position:fixed;inset:0;z-index:999;background:#edf3f8;display:grid;place-items:center;padding:18px}.auth-card{width:min(420px,100%);background:white;padding:35px;border:1px solid #dbe5ed;border-radius:15px;box-shadow:0 20px 65px #23405d22}.auth-brand{color:#2c7bb7;margin-bottom:22px}.auth-card h1{font-size:26px}.auth-card p{font-size:13px;color:#7990a5}.auth-card label{margin-top:16px}#authError{color:#c92f42}.auth-card small{display:block;color:#91a2b1;margin-top:14px}';document.head.append(css);
document.getElementById('authForm').onsubmit=async e=>{e.preventDefault();const error=document.getElementById('authError');error.textContent='Autenticando...';const {data,error:err}=await bpClient.auth.signInWithPassword({email:document.getElementById('authEmail').value.trim(),password:document.getElementById('authPassword').value});if(err){error.textContent=err.message;return}activeUser=data.user;box.remove();window.dispatchEvent(new Event('bp:authorized'))};
const user=await getActiveUser();if(user){activeUser=user;box.remove();window.dispatchEvent(new Event('bp:authorized'))}
bpClient.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_OUT'){location.reload()}});
}
window.bpReady=setupAuth();
