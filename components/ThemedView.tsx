import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export const ThemedView: React.FC<ViewProps> = ({ style, ...props }) => {
  const { isDark } = useTheme();
  
  return (
    <View 
      style={[
        { 
          backgroundColor: isDark ? '#121212' : '#F5F5F5'
        },
        style
      ]} 
      {...props} 
    />
  );
};
