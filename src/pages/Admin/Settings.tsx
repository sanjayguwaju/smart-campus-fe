import React, { useState } from 'react';
import { Save, Globe, Shield, Bell, Palette } from 'lucide-react';
import Select, { StylesConfig } from 'react-select';

// Types for settings
interface SettingOption {
  value: string;
  label: string;
}

interface BaseSetting {
  key: string;
  label: string;
  type: string;
  description?: string;
}

interface TextSetting extends BaseSetting {
  type: 'text';
  value: string;
}

interface TextareaSetting extends BaseSetting {
  type: 'textarea';
  value: string;
}

interface SelectSetting extends BaseSetting {
  type: 'select';
  value: string;
  options: SettingOption[];
}

interface ToggleSetting extends BaseSetting {
  type: 'toggle';
  value: boolean;
}

type Setting = TextSetting | TextareaSetting | SelectSetting | ToggleSetting;

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'Smart Campus',
    siteDescription: 'A comprehensive campus management system',
    emailNotifications: true,
    pushNotifications: false,
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    theme: 'light',
    timezone: 'UTC',
    language: 'en',
  });

  // Custom styles for react-select
  const selectStyles: StylesConfig<SettingOption, false> = {
    control: (provided) => ({
      ...provided,
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      minHeight: '40px',
      boxShadow: 'none',
      '&:hover': {
        border: '1px solid #d1d5db'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#f3f4f6'
      }
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999
    })
  };

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const settingSections: Array<{
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    settings: Setting[];
  }> = [
    {
      title: 'General Settings',
      icon: Globe,
      settings: [
        {
          key: 'siteName',
          label: 'Site Name',
          type: 'text',
          value: settings.siteName,
        } as TextSetting,
        {
          key: 'siteDescription',
          label: 'Site Description',
          type: 'textarea',
          value: settings.siteDescription,
        } as TextareaSetting,
        {
          key: 'timezone',
          label: 'Timezone',
          type: 'select',
          value: settings.timezone,
          options: [
            { value: 'UTC', label: 'UTC' },
            { value: 'EST', label: 'Eastern Time' },
            { value: 'PST', label: 'Pacific Time' },
            { value: 'GMT', label: 'GMT' },
          ],
        } as SelectSetting,
        {
          key: 'language',
          label: 'Language',
          type: 'select',
          value: settings.language,
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' },
          ],
        } as SelectSetting,
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          key: 'emailNotifications',
          label: 'Email Notifications',
          type: 'toggle',
          value: settings.emailNotifications,
        } as ToggleSetting,
        {
          key: 'pushNotifications',
          label: 'Push Notifications',
          type: 'toggle',
          value: settings.pushNotifications,
        } as ToggleSetting,
      ],
    },
    {
      title: 'Security',
      icon: Shield,
      settings: [
        {
          key: 'maintenanceMode',
          label: 'Maintenance Mode',
          type: 'toggle',
          value: settings.maintenanceMode,
        } as ToggleSetting,
        {
          key: 'allowRegistration',
          label: 'Allow User Registration',
          type: 'toggle',
          value: settings.allowRegistration,
        } as ToggleSetting,
        {
          key: 'requireEmailVerification',
          label: 'Require Email Verification',
          type: 'toggle',
          value: settings.requireEmailVerification,
        } as ToggleSetting,
      ],
    },
    {
      title: 'Appearance',
      icon: Palette,
      settings: [
        {
          key: 'theme',
          label: 'Theme',
          type: 'select',
          value: settings.theme,
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'auto', label: 'Auto' },
          ],
        } as SelectSetting,
      ],
    },
  ];

  const renderSettingInput = (setting: Setting) => {
    switch (setting.type) {
      case 'text':
        return (
          <input
            type="text"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
      case 'textarea':
        return (
          <textarea
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter description..."
          />
        );
      case 'select':
        return (
          <Select
            options={setting.options}
            value={setting.options.find(option => option.value === setting.value)}
            onChange={(selectedOption) => {
              if (selectedOption) {
                handleSettingChange(setting.key, selectedOption.value);
              }
            }}
            styles={selectStyles}
            placeholder="Select option..."
            isSearchable={false}
            className="w-full"
          />
        );
      case 'toggle':
        return (
          <button
            onClick={() => handleSettingChange(setting.key, !setting.value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              setting.value ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                setting.value ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage system settings and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>

      {/* Settings sections */}
      <div className="space-y-6">
        {settingSections.map((section) => (
          <div key={section.title} className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <section.icon className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {section.settings.map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">{setting.label}</label>
                      {setting.description && (
                        <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                      )}
                    </div>
                    <div className="ml-6">
                      {renderSettingInput(setting)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow border border-red-200">
        <div className="px-6 py-4 border-b border-red-200">
          <h3 className="text-lg font-medium text-red-900">Danger Zone</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Clear All Data</h4>
                <p className="text-sm text-gray-500">Permanently delete all data from the system</p>
              </div>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                Clear Data
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Reset Settings</h4>
                <p className="text-sm text-gray-500">Reset all settings to default values</p>
              </div>
              <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 