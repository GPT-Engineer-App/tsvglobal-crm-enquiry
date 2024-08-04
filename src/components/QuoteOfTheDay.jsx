import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

const motivationalQuotes = [
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { quote: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { quote: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { quote: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { quote: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" }
];

const QuoteOfTheDay = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex].quote);
    setAuthor(motivationalQuotes[randomIndex].author);
  }, []);

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <p className="text-lg font-semibold">Motivational Quote of the Day</p>
        <p className="italic">"{quote}"</p>
        <p className="text-right">- {author}</p>
      </CardContent>
    </Card>
  );
};

export default QuoteOfTheDay;
