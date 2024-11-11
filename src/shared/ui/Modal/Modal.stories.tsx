import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Modal } from 'shared/ui/Modal/Modal';
import { ThemeDecorator } from 'shared/config/storybook/ThemeDecorator/ThemeDecorator';
import { Theme } from 'app/providers/ThemeProvider';

export default {
    title: 'shared/Modal',
    component: Modal,
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    isOpen: true,
    children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at magna ultricies, efficitur odio in, sagittis felis. Sed tempus orci ut augue luctus, non tempus neque volutpat. Nam posuere lacinia tellus, sed placerat ligula elementum ac. Cras vitae sapien ut neque fermentum porta nec in enim. Aliquam dolor purus, viverra vel bibendum quis, consequat ac risus. Phasellus rutrum urna dignissim est dictum, non sollicitudin felis accumsan. Vestibulum semper velit in nulla accumsan, ac suscipit libero blandit. Donec turpis lectus, sagittis vitae luctus vel, pellentesque id massa. Fusce sit amet pretium urna, sed interdum velit. Suspendisse semper, felis ac mattis suscipit.',
};

export const Dark = Template.bind({});
Primary.args = {
    isOpen: true,
    children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at magna ultricies, efficitur odio in, sagittis felis. Sed tempus orci ut augue luctus, non tempus neque volutpat. Nam posuere lacinia tellus, sed placerat ligula elementum ac. Cras vitae sapien ut neque fermentum porta nec in enim. Aliquam dolor purus, viverra vel bibendum quis, consequat ac risus. Phasellus rutrum urna dignissim est dictum, non sollicitudin felis accumsan. Vestibulum semper velit in nulla accumsan, ac suscipit libero blandit. Donec turpis lectus, sagittis vitae luctus vel, pellentesque id massa. Fusce sit amet pretium urna, sed interdum velit. Suspendisse semper, felis ac mattis suscipit.',
};
Dark.decorators = [ThemeDecorator(Theme.DARK)];
