import './App.css';
import Dir from "./Dir";
import { GithubLink } from './components/github-link';
import { LanguageToggle } from './components/language-toggle';
import { ModeToggle } from './components/mode-toggle';
import { BetterModalProvider } from './lib/better-modal';
import { ResourcesContext, useResourcesContext } from './package';
import { useTranslation } from "react-i18next";

const version = import.meta.env.VITE_VERSION || null;

function App() {
  const {resources} = useResourcesContext();
  const {t} = useTranslation();

  return (
    <ResourcesContext.Provider value={resources}>
      <BetterModalProvider>
        <div className='relative flex min-h-screen flex-col bg-background'>
          <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='container flex h-14 items-center justify-between'>
              <div className='flex gap-2'>
                <div>
                  <strong>Dataspecer</strong> {t('dataspecer-packages')}
                </div>
                {version &&
                  <div className='inline-flex items-center rounded-full px-2.5 py-1 text-sm bg-purple-500/10 text-purple-800 dark:text-purple-400'>
                    {version}
                  </div>
                }
              </div>
              <div className='flex gap-2'>
                <GithubLink />
                <ModeToggle />
                <LanguageToggle />
              </div>
            </div>
          </header>
          <main className='flex-1 container items-start pt-5'>
            <Dir />
          </main>
        </div>
      </BetterModalProvider>
    </ResourcesContext.Provider>
  )
}

export default App
