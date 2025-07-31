/**
 * AI Content Settings - Admin Configuration for AI-Generated Content
 * 
 * PURPOSE: Configure AI settings for automatic content generation and summarization
 */

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Bot,
  Save,
  Settings,
  Wand2,
  Brain,
  Target,
  Volume2,
  Tag,
  Info
} from 'lucide-react';
import {
  getAIContentSettings,
  saveAIContentSettings,
  type AIContentSettings
} from '@/lib/articleStore';

export default function AIContentSettings() {
  const [settings, setSettings] = useState<AIContentSettings>({
    enabled: true,
    autoGenerateSummary: true,
    summaryLength: 'medium',
    includeKeywords: [],
    tone: 'professional',
    focus: 'summary'
  });
  const [keywordInput, setKeywordInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const currentSettings = getAIContentSettings();
    setSettings(currentSettings);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      saveAIContentSettings(settings);
      alert('AI content settings saved successfully!');
    } catch (error) {
      console.error('Error saving AI settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const addKeyword = () => {
    const keyword = keywordInput.trim();
    if (keyword && !settings.includeKeywords.includes(keyword)) {
      setSettings({
        ...settings,
        includeKeywords: [...settings.includeKeywords, keyword]
      });
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setSettings({
      ...settings,
      includeKeywords: settings.includeKeywords.filter(k => k !== keyword)
    });
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bot className="w-8 h-8 text-primary" />
              AI Content Settings
            </h1>
            <p className="text-muted-foreground">
              Configure AI-powered content generation and summarization for news articles
            </p>
          </div>
          <Button 
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Settings
          </Button>
        </div>

        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            These settings control how AI generates summaries and additional content for news articles. 
            Changes will apply to new content generation and can be overridden per article.
          </AlertDescription>
        </Alert>

        {/* AI Enable/Disable */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="aiEnabled">Enable AI Content Generation</Label>
                <p className="text-sm text-muted-foreground">
                  Allow AI to generate summaries and additional content for articles
                </p>
              </div>
              <Switch
                id="aiEnabled"
                checked={settings.enabled}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, enabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="autoGenerate">Auto-Generate Summaries</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically generate AI summaries when importing new articles
                </p>
              </div>
              <Switch
                id="autoGenerate"
                checked={settings.autoGenerateSummary}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, autoGenerateSummary: checked })
                }
                disabled={!settings.enabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              Content Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="summaryLength">Summary Length</Label>
                <Select
                  value={settings.summaryLength}
                  onValueChange={(value: 'short' | 'medium' | 'long') => 
                    setSettings({ ...settings, summaryLength: value })
                  }
                  disabled={!settings.enabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                    <SelectItem value="medium">Medium (2-3 sentences)</SelectItem>
                    <SelectItem value="long">Long (3-4 sentences)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Controls the length of AI-generated summaries
                </p>
              </div>

              <div>
                <Label htmlFor="tone">Tone & Style</Label>
                <Select
                  value={settings.tone}
                  onValueChange={(value: 'professional' | 'casual' | 'technical' | 'friendly') => 
                    setSettings({ ...settings, tone: value })
                  }
                  disabled={!settings.enabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  The writing style for AI-generated content
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="focus">Content Focus</Label>
              <Select
                value={settings.focus}
                onValueChange={(value: 'summary' | 'analysis' | 'commentary' | 'insights') => 
                  setSettings({ ...settings, focus: value })
                }
                disabled={!settings.enabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary - Condensed version of key points</SelectItem>
                  <SelectItem value="analysis">Analysis - Deeper examination of implications</SelectItem>
                  <SelectItem value="commentary">Commentary - Editorial perspective and opinions</SelectItem>
                  <SelectItem value="insights">Insights - Industry trends and future implications</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                The type of content AI should focus on generating
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Keywords Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Industry Keywords
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="keywords">Add Keywords</Label>
              <div className="flex gap-2">
                <Input
                  id="keywords"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={handleKeywordKeyPress}
                  placeholder="Enter industry keywords..."
                  disabled={!settings.enabled}
                />
                <Button 
                  onClick={addKeyword}
                  variant="outline"
                  disabled={!settings.enabled || !keywordInput.trim()}
                >
                  Add
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Keywords that AI should focus on when generating content
              </p>
            </div>

            <div>
              <Label>Current Keywords ({settings.includeKeywords.length})</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {settings.includeKeywords.map((keyword) => (
                  <Badge 
                    key={keyword} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeKeyword(keyword)}
                  >
                    {keyword}
                    <span className="ml-1 text-xs">×</span>
                  </Badge>
                ))}
                {settings.includeKeywords.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No keywords added. AI will use default industry terms.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Configuration Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </Label>
                  <p className={settings.enabled ? 'text-green-600' : 'text-red-600'}>
                    {settings.enabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <div>
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Auto-Generate
                  </Label>
                  <p>{settings.autoGenerateSummary ? 'On' : 'Off'}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Summary Length
                  </Label>
                  <p className="capitalize">{settings.summaryLength}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Tone
                  </Label>
                  <p className="capitalize">{settings.tone}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Focus
                  </Label>
                  <p className="capitalize">{settings.focus}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Keywords
                  </Label>
                  <p>{settings.includeKeywords.length} configured</p>
                </div>
              </div>

              {settings.enabled && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <Label className="text-sm font-medium">Sample AI Prompt Template:</Label>
                  <p className="text-sm text-muted-foreground mt-2">
                    "Generate a <strong>{settings.summaryLength}</strong> {settings.focus} in a <strong>{settings.tone}</strong> tone
                    {settings.includeKeywords.length > 0 && (
                      <> focusing on <strong>{settings.includeKeywords.join(', ')}</strong></>
                    )}
                    for the following article content..."
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save Button (Footer) */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSaveSettings}
            disabled={isSaving}
            size="lg"
          >
            {isSaving ? (
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save AI Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
