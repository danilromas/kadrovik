import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-bold text-primary mb-4">404</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Страница не найдена</h1>
        <p className="text-muted-foreground mb-8">
          К сожалению, запрашиваемая страница не существует или была удалена
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              На главную
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/vacancies">
              <Search className="h-4 w-4 mr-2" />
              Искать вакансии
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
