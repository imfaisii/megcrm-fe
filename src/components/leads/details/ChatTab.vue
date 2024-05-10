<script lang="ts" setup>
import useApiFetch from "@/composables/useApiFetch";
import useTime from "@/composables/useTime";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useLeadsStore } from "@/stores/leads/useLeadsStore";
import avatar4 from "@images/avatars/avatar-2.png";
import avatar3 from "@images/avatars/avatar-3.png";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";

type Message = {
  user_id: number;
  comment: string;
  created_at: string;
  commentator: {
    name: string;
  };
};

const props = defineProps({
  messages: {
    type: Array as () => Message[],
    default: () => [],
    required: true,
  },
});

const time: any = useTime();
const auth: any = useAuthStore();
const leadStore: any = useLeadsStore();

const loading = ref(false);
const msg = ref("");
const chatBox = ref();

const scrollToBottomInChatLog = () => {
  const scrollEl = chatBox.value.$el || chatBox.value;

  scrollEl.scrollTop = scrollEl.scrollHeight;
};

const sendMessage = async () => {
  try {
    loading.value = true;

    const { data } = await useApiFetch(
      `/leads/${leadStore.selectedLead.id}/comments`,
      {
        method: "POST",
        data: {
          comments: msg.value,
        },
      }
    );

    messagesSorted.value.push(data);
    msg.value = "";
    setTimeout(() => {
      scrollToBottomInChatLog();
    }, 100);
  } catch (e) {
    //
  } finally {
    loading.value = false;
  }
};

const messagesSorted = ref([...props.messages].reverse());

onMounted(() => {
  scrollToBottomInChatLog();
});
</script>

<template>
  <VLayout class="chat-app-layout bg-card">
    <VMain class="chat-content-container">
      <div class="flex-grow-1">
        <PerfectScrollbar
          ref="chatBox"
          tag="ul"
          :options="{ wheelPropagation: false }"
        >
          <div class="chat-log pa-5">
            <div
              v-for="(message, index) in messagesSorted"
              :key="message.user_id + String(index)"
              class="chat-group d-flex align-start"
              :class="[
                {
                  'flex-row-reverse': message.user_id === auth.user.id,
                  'mb-8': messages.length - 1 !== index,
                },
              ]"
            >
              <div
                class="chat-avatar"
                :class="message.user_id !== auth.user.id ? 'ms-4' : 'me-4'"
              >
                <VTooltip location="top">
                  <template #activator="{ props }">
                    <VAvatar v-bind="props" size="32">
                      <VImg
                        :src="
                          message.user_id !== auth.user.id ? avatar3 : avatar4
                        "
                      />
                    </VAvatar>
                  </template>
                  <span>{{ message?.commentator?.name ?? "No name" }}</span>
                </VTooltip>
              </div>
              <div
                class="chat-body d-inline-flex flex-column"
                :class="
                  message.user_id === auth.user.id ? 'align-end' : 'align-start'
                "
              >
                <p
                  :key="message.created_at"
                  class="chat-content text-sm py-3 px-4 elevation-1"
                  :class="[
                    message.user_id !== auth.user.id
                      ? 'bg-card text-high-emphasis chat-left'
                      : 'bg-primary text-white chat-right',
                  ]"
                >
                  {{ message.comment }}
                </p>
                <span class="text-xs ms-1 mb-1 text-disabled">
                  {{ time.formatDate(message.created_at, "lll") }}
                </span>
              </div>
            </div>
          </div>
        </PerfectScrollbar>

        <VForm
          class="chat-log-message-form my-5 mx-5"
          @submit.prevent="sendMessage"
        >
          <VTextField
            :key="auth.user.id"
            v-model="msg"
            density="comfortable"
            variant="solo"
            class="chat-message-input my-4"
            placeholder="Type your message..."
            autofocus
          >
            <template #append-inner>
              <IconBtn
                size="large"
                @click="sendMessage"
                :loading="loading"
                :disabled="loading || [null, ''].includes(msg)"
              >
                <VIcon color="primary" size="x-large" icon="mdi-send-circle" />
              </IconBtn>
            </template>
          </VTextField>
        </VForm>
      </div>
    </VMain>
  </VLayout>
</template>

<style lang="scss">
@use "@styles/variables/_vuetify.scss";
@use "@core/scss/base/_mixins.scss";
@use "@layouts/styles/mixins" as layoutsMixins;

// Variables
$chat-app-header-height: 68px;

// Placeholders
%chat-header {
  display: flex;
  align-items: center;
  min-block-size: $chat-app-header-height;
  padding-inline: 1.3rem;
}

.chat-app-layout {
  border-radius: vuetify.$card-border-radius;

  @include mixins.elevation(vuetify.$card-elevation);

  $sel-chat-app-layout: &;

  @at-root {
    .skin--bordered {
      @include mixins.bordered-skin($sel-chat-app-layout);
    }
  }

  .active-chat-user-profile-sidebar,
  .user-profile-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }

  .chat-list-header,
  .active-chat-header {
    @extend %chat-header;
  }

  .chat-list-search {
    .v-field__outline__start {
      flex-basis: 20px !important;
      border-radius: 28px 0 0 28px !important;
    }

    .v-field__outline__end {
      border-radius: 0 28px 28px 0 !important;
    }

    @include layoutsMixins.rtl {
      .v-field__outline__start {
        flex-basis: 20px !important;
        border-radius: 0 28px 28px 0 !important;
      }

      .v-field__outline__end {
        border-radius: 28px 0 0 28px !important;
      }
    }
  }

  .chat-list-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }
}

.chat-content-container {
  background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));

  // Adjust the padding so text field height stays 48px
  .chat-message-input {
    .v-field__append-inner {
      align-items: center;
      padding-block-start: 0;
    }

    .v-field--appended {
      padding-inline-end: 1rem;
      padding-block: 0.2rem;
    }
  }
}

.chat-user-profile-badge {
  .v-badge__badge {
    /* stylelint-disable liberty/use-logical-spec */
    min-width: 12px !important;
    height: 0.75rem;
    /* stylelint-enable liberty/use-logical-spec */
  }
}

.chat-log {
  height: 50rem;

  .chat-content {
    border-end-end-radius: 8px;
    border-end-start-radius: 8px;

    &.chat-left {
      border-start-end-radius: 8px;
    }

    &.chat-right {
      border-start-start-radius: 8px;
    }
  }
}
</style>
