/**
 * Fallback para quando WebGL não está disponível ou reduced motion ativo.
 * Mostra imagem real do produto com tratamento elegante.
 */
export function WebGLFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <img
        src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-black-titanium-select?wid=800&hei=800&fmt=jpeg&qlt=90"
        alt="Smartphone premium — Andinho Import"
        className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl"
        loading="eager"
      />
    </div>
  );
}
