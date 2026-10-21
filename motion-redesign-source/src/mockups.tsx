import { Bell, CalendarDays, ChevronRight, Heart, MessageCircle, Settings, ShieldCheck, Smile, Star, Volume2 } from 'lucide-react'

export type PhoneVariant = 'home' | 'child' | 'manage'

/** Telas ilustrativas do app desenhadas em código (não são capturas reais). */
export function PhoneUI({ variant }: { variant: PhoneVariant }) {
  if (variant === 'home') {
    return (
      <div className="pu pu-home" role="img" aria-label="Ilustração da tela de comunicação do aplicativo, com categorias coloridas">
        <div className="pu-top"><span className="pu-avatar">A</span><div><b>Oi, Ana!</b><small>o que você quer dizer?</small></div><Volume2 size={16} /></div>
        <div className="pu-phrase"><small>minha frase</small><b>Eu quero comer</b></div>
        <div className="pu-grid">
          <span className="pu-tile t-coral"><i>🍎</i>Comer</span>
          <span className="pu-tile t-blue"><i>💧</i>Água</span>
          <span className="pu-tile t-yellow"><i>😊</i>Feliz</span>
          <span className="pu-tile t-green"><i>🧩</i>Brincar</span>
          <span className="pu-tile t-purple"><i>🛋️</i>Descansar</span>
          <span className="pu-tile t-coral"><i>🫶</i>Ajuda</span>
        </div>
        <div className="pu-nav"><MessageCircle size={17} /><Star size={17} /><CalendarDays size={17} /><Settings size={17} /></div>
      </div>
    )
  }
  if (variant === 'child') {
    return (
      <div className="pu pu-child" role="img" aria-label="Ilustração do modo criança, com botões grandes de comunicação, favoritos, rotina e humor">
        <div className="pu-top"><span className="pu-avatar">A</span><div><b>Modo criança</b><small>escolhas grandes</small></div></div>
        <div className="pu-big">
          <span className="pu-bigtile t-coral"><MessageCircle size={30} />Comunicar</span>
          <span className="pu-bigtile t-yellow"><Star size={30} />Favoritos</span>
          <span className="pu-bigtile t-green"><CalendarDays size={30} />Minha rotina</span>
          <span className="pu-bigtile t-blue"><Smile size={30} />Como me sinto</span>
        </div>
        <div className="pu-mood"><span>😊</span><span>😐</span><span>😢</span><span>😴</span></div>
      </div>
    )
  }
  return (
    <div className="pu pu-manage" role="img" aria-label="Ilustração do modo responsável, com perfil, rotina, lembretes e ajustes">
      <div className="pu-top"><span className="pu-avatar">A</span><div><b>Perfil da Ana</b><small>modo responsável</small></div></div>
      <div className="pu-rows">
        <span><CalendarDays size={16} /><b>Rotina de hoje</b><small>3 de 5</small><ChevronRight size={14} /></span>
        <span><Bell size={16} /><b>Lembretes</b><small>2 ativos</small><ChevronRight size={14} /></span>
        <span><Heart size={16} /><b>Favoritos</b><small>6 frases</small><ChevronRight size={14} /></span>
        <span><Volume2 size={16} /><b>Voz e velocidade</b><small>pt-BR</small><ChevronRight size={14} /></span>
        <span><ShieldCheck size={16} /><b>PIN de ajustes</b><small>ativo</small><ChevronRight size={14} /></span>
      </div>
      <div className="pu-note">ilustração do conceito</div>
    </div>
  )
}
