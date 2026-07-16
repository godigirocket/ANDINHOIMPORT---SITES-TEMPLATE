import { useState } from 'react';
import { MessageCircle, Plus, Trash2, Save, Eye, Settings } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { useChatbotStore, ChatbotQuestion } from '@/lib/stores/chatbotStore';
import { generateUUID } from '@/lib/utils/uuid';

export default function ChatbotAdmin() {
  const { config, updateConfig, addQuestion, updateQuestion, deleteQuestion, updateAutoResponse } = useChatbotStore();
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

  const handleAddQuestion = () => {
    const newQuestion: ChatbotQuestion = {
      id: generateUUID(),
      label: 'Nova pergunta',
      emoji: '❓',
      response: 'Resposta automática aqui...',
      followUpOptions: []
    };
    addQuestion(newQuestion);
    setEditingQuestion(newQuestion.id);
    toast.success('Pergunta adicionada!');
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta pergunta?')) {
      deleteQuestion(id);
      toast.success('Pergunta excluída!');
    }
  };

  const handleSaveQuestion = (id: string, updates: Partial<ChatbotQuestion>) => {
    updateQuestion(id, updates);
    setEditingQuestion(null);
    toast.success('Pergunta salva!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-primary" />
              Configurar Chatbot
            </h1>
            <p className="text-sm text-muted-foreground">Personalize perguntas, respostas e comportamento do chatbot</p>
          </div>
          <button
            onClick={() => updateConfig({ enabled: !config.enabled })}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              config.enabled
                ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                : 'bg-red-500/20 text-red-500 border border-red-500/30'
            }`}
          >
            {config.enabled ? '✅ Ativo' : '❌ Desativado'}
          </button>
        </div>

        {/* Configurações Gerais */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            Configurações Gerais
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold block mb-2">Mensagem de Boas-Vindas</label>
              <textarea
                value={config.welcomeMessage}
                onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-sm resize-none"
                rows={5}
                placeholder="Use {COMPANY_NAME} para inserir o nome da empresa"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use <code className="px-1 py-0.5 bg-surface rounded">{'{COMPANY_NAME}'}</code> para inserir o nome da empresa automaticamente
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-2">Unidade de Medida dos Produtos</label>
              <select
                value={config.productUnit}
                onChange={(e) => updateConfig({ productUnit: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-surface border border-border text-sm"
              >
                <option value="unidade">Unidade (celular, notebook, etc)</option>
                <option value="kg">Quilograma (alimentos, suplementos)</option>
                <option value="litro">Litro (bebidas, líquidos)</option>
                <option value="pacote">Pacote (roupas, acessórios)</option>
                <option value="caixa">Caixa (produtos em caixa)</option>
                <option value="peça">Peça (roupas, móveis)</option>
                <option value="metro">Metro (tecidos, cabos)</option>
                <option value="par">Par (sapatos, meias)</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Define como o chatbot se refere aos produtos (ex: "1 unidade", "1 kg", "1 litro")
              </p>
            </div>
          </div>
        </div>

        {/* Perguntas Rápidas */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              Perguntas Rápidas
            </h2>
            <button
              onClick={handleAddQuestion}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs hover:bg-primary/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar
            </button>
          </div>

          <div className="space-y-3">
            {config.questions.map((question) => (
              <div key={question.id} className="p-4 rounded-xl bg-surface border border-border/50">
                {editingQuestion === question.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold block mb-1">Emoji</label>
                        <input
                          type="text"
                          defaultValue={question.emoji}
                          onChange={(e) => updateQuestion(question.id, { emoji: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm"
                          placeholder="📱"
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">Texto do Botão</label>
                        <input
                          type="text"
                          defaultValue={question.label}
                          onChange={(e) => updateQuestion(question.id, { label: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm"
                          placeholder="Ver produtos"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">Resposta Automática</label>
                      <textarea
                        defaultValue={question.response}
                        onChange={(e) => updateQuestion(question.id, { response: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm resize-none"
                        rows={4}
                        placeholder="Resposta que o bot vai dar..."
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Use <code className="px-1 py-0.5 bg-surface rounded">{'{PRODUCT_LIST}'}</code> para listar produtos automaticamente
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveQuestion(question.id, {})}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs hover:bg-primary/20 transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingQuestion(null)}
                        className="px-3 py-2 rounded-lg bg-surface border border-border text-xs hover:bg-background transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{question.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold">{question.label}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{question.response}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingQuestion(question.id)}
                        className="p-2 rounded-lg hover:bg-background transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Respostas Automáticas */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-bold mb-4">Respostas Automáticas (quando usuário digita)</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold block mb-2">💰 Quando perguntar sobre PREÇO</label>
              <textarea
                value={config.autoResponses.price}
                onChange={(e) => updateAutoResponse('price', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-sm resize-none"
                rows={4}
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-2">🚚 Quando perguntar sobre ENTREGA</label>
              <textarea
                value={config.autoResponses.delivery}
                onChange={(e) => updateAutoResponse('delivery', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-sm resize-none"
                rows={4}
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-2">✅ Quando perguntar sobre GARANTIA</label>
              <textarea
                value={config.autoResponses.warranty}
                onChange={(e) => updateAutoResponse('warranty', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-sm resize-none"
                rows={4}
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-2">💳 Quando perguntar sobre PAGAMENTO</label>
              <textarea
                value={config.autoResponses.payment}
                onChange={(e) => updateAutoResponse('payment', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-sm resize-none"
                rows={4}
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-2">🎁 Quando perguntar sobre PROMOÇÃO</label>
              <textarea
                value={config.autoResponses.promotion}
                onChange={(e) => updateAutoResponse('promotion', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-sm resize-none"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-bold mb-4">Preview</h2>
          <div className="p-4 rounded-xl bg-surface border border-border/50">
            <p className="text-xs text-muted-foreground mb-3">Mensagem de boas-vindas:</p>
            <p className="text-sm whitespace-pre-line mb-4">
              {config.welcomeMessage.replace('{COMPANY_NAME}', 'Sua Loja')}
            </p>
            <div className="flex flex-wrap gap-2">
              {config.questions.map((q) => (
                <button
                  key={q.id}
                  className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs"
                >
                  {q.emoji} {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
